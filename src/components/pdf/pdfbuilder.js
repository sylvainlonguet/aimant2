import JsPDF from "jspdf";
import React from "react";
import logoAimant from "../../images/LOGO AIMANT.jpeg"; // image d'entete
import "../../fonts/Didot-normal.js"; // Police Didot Normal
import "../../fonts/Didot-bold.js"; // Police Didot Normal

// Charger Didot dans le CSS (côté navigateur)
const loadFont = () => {
  const style = document.createElement("style");
  style.innerHTML = `
      @font-face {
        font-family: 'Didot';
        src: url('../../fonts/Didot Regular.ttf') format('truetype');
      }
      .didot {
        font-family: 'Didot' ,serif;
      }
    `;
  document.body.appendChild(style);
  return style;
};

function extract_titre(data) {
  return data.wpPost.title;
}
function extract_sous_titre(data) {
  const {
    wpPost: { categories },
  } = data;
  const slug = categories.nodes[0].slug;
  switch (slug) {
    case "comediennes":
      return "Comédienne";

    case "comedien":
      return "Comédien";

    case "metteur-e-s-en-scene":
      return "Metteur en scène";
  }
  return "";
}
function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || doc.body.innerText;
}

function extract_common_data(data, key) {
  const content = data.allWpPost.nodes.filter(
    (p) => p.categories.nodes[0].slug === key
  )[0].content;

  return htmlToText(content);
}
/**
 * retourne le bloc HTML d'entete avec les infos de l'agence
 */
function get_html_agency(adresse, url, telephone, nom, mail) {
  // NB : La police Didot est assez mal rendue avec jsPDF. Il vaut mieux doubler les espaces

  //adresse = adresse.replaceAll(" ", "&nbsp;&nbsp;");

  //nom = nom.replaceAll(" ", "&nbsp;&nbsp;");

  const el = document.createElement("div");
  el.innerHTML = `<div style='width:585px' class = 'didot'> 
                    <p  style='text-align:center;margin-bottom:7px'>
                        ${adresse} - ${telephone} &nbsp;
                        <span style='color:red;text-decoration:underline;'>www.aimant.art</span>
                    </p>
                    <p style='text-align:center'>
                        Agent : ${nom}&nbsp&nbsp- &nbsp;
                        <span style='color:red;text-decoration:underline'>${mail}</span>
                    </p>
                </div>`;
  document.body.appendChild(el);

  return el;
}

/**
 * retourne le footer du PDF
 */
function get_html_footer(adresse, url, telephone, nom, mail) {
  const el = document.createElement("div");
  el.innerHTML = `<div style='width:585px'> 
                      <p style='text-align:center;margin-bottom:7px' class='didot'>
                          <span style='color:red;'>aimant </span>
                          - ${adresse}&nbsp//&nbsp;${telephone}&nbsp; 
                          <span style='color:red;text-decoration:underline'>www.aimant.art</span>
                      </p>
                      
                  </div>`;
  document.body.appendChild(el);

  return el;
}

/**
 * retourne le bloc des 2 photos ..
 *  */
function get_html_images(images) {
  const contentDiv = document.createElement("div");
  contentDiv.style.width = "585px";

  // Créer les éléments d'image
  for (let ii = 0; ii < 2; ii++) {
    let image = images[ii];

    let img = document.createElement("img");
    img.src = image.src;
    //img.style.width = "220px";
    img.style.height = "250px";
    img.style.objectFit = "cover";
    if (ii == 0) {
      let finalMargin = Math.max(71 + 220 - (img.width / img.height) * 250, 71);
      if (isNaN(finalMargin)) finalMargin = 71;

      console.log(finalMargin);
      img.style.marginLeft = `${finalMargin}px`;
      img.style.marginRight = "1px";
    } else {
      img.style.marginLeft = "1px";
      img.style.marginRight = "0px";
    }
    contentDiv.appendChild(img);
  }

  document.body.appendChild(contentDiv);

  return contentDiv;
}

export default {
  async build(data) {
    const tempNodes = [];
    const titre = extract_titre(data);
    const sousTitre = extract_sous_titre(data);
    const txt_num_tel = extract_common_data(data, "numero");

    // sit web de l'agence
    const txt_url_agence = extract_common_data(data, "contact");
    const txt_adresse_post_agence = extract_common_data(data, "ville");

    // adr mail vanier ???
    const html_mail_vanier = extract_common_data(data, "adresse");

    // adr mai de 'agent
    const txt_mail_agent = extract_common_data(data, "mail");

    // Nom de l'agent
    const txt_nom_agent = extract_common_data(data, "nom");

    //const promises_HTML = [];

    const report = new JsPDF("portrait", "pt", "a4");
    //report.setFont("Didot Regular", "normal");

    const tempStyle = loadFont();
    tempNodes.push(tempStyle);

    let current_pos = 15;
    const INTERLN = 15;

    // Logo AIMANT ////////////
    const pageWidth = report.internal.pageSize.width;
    const imageWidth = 100; // Largeur de l'image
    const imageHeight = 100; // Hauteur de l'image
    const imageX = (pageWidth - imageWidth) / 2; // Calculer pour centrer
    const imageY = current_pos; // Position Y de l'image
    report.addImage(logoAimant, "PNG", imageX, imageY, imageWidth, imageHeight);

    current_pos += imageHeight;

    current_pos += INTERLN / 2;

    // entete
    const htmlAgency = get_html_agency(
      txt_adresse_post_agence,
      txt_url_agence,
      txt_num_tel,
      txt_nom_agent,
      txt_mail_agent
    );
    tempNodes.push(htmlAgency);

    await report.html(htmlAgency, {
      x: 5,
      y: current_pos,
    });

    current_pos += 75;

    // Nom de l'artiste
    report.setFontSize(24);
    report.setFont("Didot", "normal");
    report.setTextColor(255, 0, 0); // Couleur noire
    report.text(titre, pageWidth / 2, current_pos, {
      align: "center",
    });
    current_pos += 20;

    // Sous-titre (categorie)
    report.setFontSize(15);
    report.setTextColor(100, 100, 100); // Couleur gris foncé
    report.text(sousTitre, pageWidth / 2, current_pos, {
      align: "center",
    });

    current_pos += 20;

    // Images
    const images = document.querySelectorAll("#cv img[data-wp-inline-image]");
    const html_images = get_html_images([images[1], images[3]]);
    tempNodes.push(html_images);
    await report.html(html_images, {
      x: 5,
      y: current_pos,
    });

    current_pos += 260;

    console.log("Construction du CV");

    // Le CV
    const blocs_CV = document.querySelectorAll("#cv div.wp-block-column");
    const blocTXT = blocs_CV[1];

    // pied de page / page 1
    const footer1 = get_html_footer(
      txt_adresse_post_agence,
      txt_url_agence,
      txt_num_tel,
      txt_nom_agent,
      txt_mail_agent
    );
    tempNodes.push(footer1);
    await report.html(footer1, {
      x: 5,
      y: 810,
      width: 500,
    });

    let textToDisplay = "";
    let nbPages = 0;
    for (const child of blocTXT.children) {
      let lineBreak =
        (child.tagName == "H3" && current_pos % 842 > 650) ||
        current_pos % 842 > 800;
      if (lineBreak) {
        nbPages++;
        report.addPage();
        current_pos = 30;
      }

      if (child.tagName === "H3") {
        // titre de section de CV
        current_pos += 15;
        textToDisplay = child.innerText.toUpperCase();
        report.setFont("Times", "bold");
        report.setFontSize(13);
        report.setTextColor(0, 0, 0); // Couleur noire
        report.text(textToDisplay, 50, current_pos);
      } else {
        textToDisplay = child.innerText;
        if (child.innerHTML.includes("<em>")) {
          // en italique
          report.setFont("Times", "italic");
        } else {
          // en normal
          report.setFont("Times", "normal");
        }
        report.setFontSize(13);
        report.setTextColor(0, 0, 0); // Couleur noire
        report.text(textToDisplay, 50, current_pos);
      }
      current_pos += 15;

      if (lineBreak) {
        // IMP! : faire le footer une fois seulement qu'on a commencé à écrire sur la nouvelle page
        // autrement JsPdf bugge!

        let newFooter = get_html_footer(
          txt_adresse_post_agence,
          txt_url_agence,
          txt_num_tel,
          txt_nom_agent,
          txt_mail_agent
        );
        tempNodes.push(newFooter);

        await report.html(newFooter, {
          x: 5,
          y: 810 + nbPages * 842,
          width: 500,
        });
      }
    }

    report.save(`${titre}`);

    /*
    tempNodes.forEach((element) => {
      document.body.removeChild(element);
    });
*/
    //document.body.removeChild(htmlAgency);
    //document.body.removeChild(htmlAgent);
  },

  wrap(htmlContent) {
    return `
      
        
        ${htmlContent.outerHTML}
      
    `;
  },
};
