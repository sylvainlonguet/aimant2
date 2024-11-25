import React, { useState } from "react";
import { graphql } from "gatsby";
import parse from "html-react-parser";
// import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import Vimeo from "@u-wave/react-vimeo";
import YouTube from "react-youtube";
import "../components/style.scss";

import logo from "../images/aimant_logo.png";
import { parseSrcset, stringifySrcset } from "srcset";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import logopdf from "../images/pdf.png";
import pdfbuilder from "../components/pdf/pdfbuilder";
import SEOArtiste from "../components/seoartiste";

const ref = React.createRef();

const options = {
  buttons: {
    showAutoplayButton: false,
    showCloseButton: true,
    showDownloadButton: false,
    showFullscreenButton: false,
    showNextButton: true,
    showPrevButton: true,
    showThumbnailsButton: false,
  },
  thumbnails: {
    showThumbnails: false,
  },
  caption: {
    captionAlignment: "center",
    captionColor: "#FFFFFF",
    showCaption: true,
  },
};

const getIntituleMetierFromSlug = (slug) => {
  switch (slug) {
    case "comediennes":
      return "Comédienne";

    case "comedien":
      return "Comédien";

    case "metteur-e-s-en-scene":
      return "Metteur en scène";
  }
  return "";
};

const replaceImage = (content) =>
  content &&
  content.replace(
    /http:\/\/aimantarwm.cluster021.hosting.ovh.net/gim,
    `https://cms.aimant.art`
  );

const WpPost = ({ data }) => {
  const [firstPic, setFirstPic] = useState("");
  const [srcSet, setSrcSet] = useState("");
  const [open, setOpen] = React.useState(false);

  const generatePDF = () => {
    pdfbuilder.build(data);
  };

  const {
    wpPost: { title, content, uri, id, acf, categories },
  } = data;

  // Initulé "élégant" lié à la catégorie 'Comédienne' ...
  const metier = getIntituleMetierFromSlug(categories.nodes[0].slug);

  const clearContent = replaceImage(content);
  const { video = "" } = acf || {};
  const { bannerpicture = "" } = acf || {};
  const { bannertext = "" } = acf || {};
  const isVimeo = video && video.indexOf("vimeo") >= 0;
  const youtubeMatches =
    !isVimeo &&
    video &&
    video.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
  const youtubeId =
    youtubeMatches && youtubeMatches.length >= 1 ? youtubeMatches[2] : "";
  const postHaveBanner = clearContent.indexOf("banner") >= 0;
  const bannerClass = `banner-container${!postHaveBanner ? " banner-red" : ""}`;
  const numero = data.allWpPost.nodes.filter(
    (p) => p.categories.nodes[0].slug === "numero"
  );
  const contact = data.allWpPost.nodes.filter(
    (p) => p.categories.nodes[0].slug === "contact"
  );
  const nom = data.allWpPost.nodes.filter(
    (p) => p.categories.nodes[0].slug === "nom"
  );
  const mail = data.allWpPost.nodes.filter(
    (p) => p.categories.nodes[0].slug === "mail"
  );
  const regex = /(https?:\/\/.*\.(?:png|jpg|jpeg))/i;

  const srcSetObject = [];

  setTimeout(() => {
    if (typeof document !== `undefined`) {
      const imgList = document.querySelectorAll("img");
      const bannerCont = document.getElementsByClassName("banner-container");
      const selectedImgList = [];
      imgList.forEach((p, index) => {
        if (index % 2 !== 0 && p.currentSrc !== "") {
          selectedImgList.push(p);
        }
      });
      selectedImgList.forEach((p, index) => {
        p.classList.add(`pic${index}`);
        p.addEventListener("click", (e) => handleBox(e));
      });
    }
  }, 500);

  const handleBox = (e) => {
    if (typeof document !== `undefined`) {
      e.preventDefault();
      const imgList = document.querySelectorAll("img");
      const selectedImg = [];
      const arrayRest = [];
      const orderedSrcSet = [];
      imgList.forEach((p, index) => {
        if (index % 2 !== 0 && p.currentSrc !== "") {
          selectedImg.push(p);
        }
      });
      selectedImg.forEach((p, index) => {
        if (`pic${index}` === e.target.className) {
          orderedSrcSet.push(p);
        } else {
          arrayRest.push(p);
        }
      });
      const el = arrayRest.shift();
      arrayRest.map((p) => {
        orderedSrcSet.push(p);
      });
      orderedSrcSet.push(el);
      orderedSrcSet.map((p) => {
        if (p !== undefined) {
          srcSetObject.push({ src: p.currentSrc, title: p.alt });
        }
      });
      setSrcSet(srcSetObject);
      setOpen(true);
    }
  };

  return (
    <React.Fragment>
      <SEOArtiste
        title={`.:: ${title} - aimant - agence artistique ::.`}
        description={`${title} ${metier} Agent : François Tessier f.tessier@aimant.art`}
      />
      <div className={`post-${id}`}>
        {bannerpicture && bannerpicture.sourceUrl && (
          <div
            className={bannerClass}
            style={{
              backgroundImage: `url(${bannerpicture.sourceUrl})`,
            }}
          >
            {!postHaveBanner && bannertext && (
              <div className="nameBig">{bannertext}</div>
            )}
          </div>
        )}
        {video && (
          <React.Fragment>
            {" "}
            {isVimeo ? (
              <Vimeo
                className="artist-video"
                video={video}
                autplay={true}
                autopause={true}
                height="350"
                width="800"
              />
            ) : (
              <div className="artist-video">
                <YouTube
                  videoId={youtubeId}
                  opts={{
                    height: "390",
                    width: "640",
                    playerVars: {
                      autoplay: 1,
                    },
                  }}
                />
              </div>
            )}
          </React.Fragment>
        )}

        <button
          onClick={generatePDF}
          title="Convertir en PDF"
          className="cv__button pdf-button"
        >
          <img src={logopdf} alt="Convertir le CV en PDF"></img>
        </button>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={srcSet}
        plugins={[Captions]}
      />

      <div id="cv">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {/* <div className="cv__infos">
                        <img src={logo} className="cv__logo" />

                    <div>
                    {nom.map((c) => (
                        <p key={c.uri}>
                            {c.content.replace(/<\/?[^>]*?>/gi, '')}
                        </p>
                    ))}
                    {mail.map((c) => (
                      <a key={c.uri} href={`mailto:${c.content.replace(/<\/?[^>]*?>/gi, '')}`}>
                        <p >{c.content.replace(/<\/?[^>]*?>/gi, '')}</p>
                      </a>
                    ))}
                    {numero.map((c) => (
                      <p key={c.uri} >
                        {c.content.replace(/<\/?[^>]*?>/gi, '')}
                      </p>
                    ))}
                    {contact.map((c) => (
                      <a key={c.uri} href={`mailto:${c.content.replace(/<\/?[^>]*?>/gi, '')}`}>
                        <p >{c.content.replace(/<\/?[^>]*?>/gi, '')}</p>
                      </a>
                    ))}
                </div>
            </div>  */}
      </div>
    </React.Fragment>
  );
};

export default WpPost;

export const query = graphql`
  query ($id: String) {
    wpPost(id: { eq: $id }) {
      id
      title
      content
      uri
      acf {
        bannertext
        bannerpicture {
          sourceUrl
        }
        video
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
    }
    allWpPost(limit: 1000, sort: { title: ASC }) {
      nodes {
        id
        title
        content
        excerpt
        uri
        acf {
          mignature {
            id
            sourceUrl
          }
        }
        categories {
          nodes {
            id
            slug
          }
        }
      }
    }
    allWpCategory {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;
