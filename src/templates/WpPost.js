import React, { useState } from 'react';

import { graphql } from "gatsby"
import parse from 'html-react-parser';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import Vimeo from '@u-wave/react-vimeo';
import YouTube from 'react-youtube';
import '../components/style.scss'
import JsPDF from 'jspdf';
import logo from '../images/aimant_logo.png'


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
      captionAlignment: 'center',
      captionColor: '#FFFFFF',
      showCaption: true,
    },
  };

 

 
 
  
  const replaceImage = (content) =>
    content &&
    content.replace(/http:\/\/aimantarwm.cluster021.hosting.ovh.net/gim, `https://cms.aimant.art`);


    const WpPost = ({ data }) => {

      const [isVisible, setIsVisible] = useState(false);    

      
      const handleCV = () => {
        setIsVisible(true)
       }
     

       const generatePDF = () => {
        setIsVisible(true)
 
        console.log('clicked')
      const report = new JsPDF('portrait','pt','a1');
     
      report.html(document.querySelector('#cv')).then(() => {
          report.save(`${title}`);
     
      });
      setTimeout(() => {
        setIsVisible(false)
      }, 500)
   
  
   
     
    }
      
      const {
          wpPost: { title, content, uri, id,  acf }
        } = data
        const clearContent = replaceImage(content);
        const { video = '' } = acf || {};
        const { bannerpicture = '' } = acf || {};
        const { bannertext = '' } = acf || {};
        const isVimeo = video && video.indexOf('vimeo') >= 0;
        const youtubeMatches =
        !isVimeo && video && video.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
      const youtubeId = youtubeMatches && youtubeMatches.length >= 1 ? youtubeMatches[2] : '';

      const postHaveBanner = clearContent.indexOf('banner') >= 0;
      const bannerClass = `banner-container${!postHaveBanner ? ' banner-red' : ''}`;
    
      const numero = data.allWpPost.nodes.filter(
        (p) => (p.categories.nodes[0].slug === "numero") ,
      );
    
      const contact = data.allWpPost.nodes.filter(
        (p) => (p.categories.nodes[0].slug === "contact") ,
      );

      const nom = data.allWpPost.nodes.filter(
        (p) => (p.categories.nodes[0].slug === "nom") ,
      );
    
    
      const mail = data.allWpPost.nodes.filter(
        (p) => (p.categories.nodes[0].slug === "mail") ,
      );
   
      console.log(data)


        return (
            <SimpleReactLightbox>
              <React.Fragment>
                <div className={`post-${id}`} >
                  {bannerpicture &&
                    bannerpicture.sourceUrl && (
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
                      {' '}
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
                              height: '390',
                              width: '640',
                              playerVars: {
                                autoplay: 1,
                              },
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  )}


{/* { isVisible? 
<div className="popin">    <React.Fragment> <div className="popin__inside" id="report"> POPIN 
<div className="popin__inside__content" dangerouslySetInnerHTML={{ __html: content }} />
<button onClick={generatePDF}   type="button">Export PDF</button>
</div>
</React.Fragment>
 </div>
  : ''} */}


<p onClick={generatePDF} className="cv__button">Télécharger le CV en PDF</p>
          </div>
         
      <div id="cv" >
    
      
         
         <div  dangerouslySetInnerHTML={{ __html: content }} />
         <div className="cv__infos">
        <img src={logo} className="cv__logo" />
       <div>

       {nom.map((c) => (
  <p key={c.uri} >
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
              </div> 
         </div>
   
          </React.Fragment>
          </SimpleReactLightbox>
        )
      }
      
    

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
    }
    allWpPost(
      limit: 1000
      sort: {title: ASC}
      ) {
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
`

