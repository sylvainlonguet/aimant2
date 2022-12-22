import React from "react"
import { graphql } from "gatsby"
import parse from 'html-react-parser';
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox';
import Vimeo from '@u-wave/react-vimeo';
import YouTube from 'react-youtube';
import '../components/style.scss'


import contentParser from 'gatsby-wpgraphql-inline-images';

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

      console.log(data)

  
    
        return (
            <SimpleReactLightbox>
      <React.Fragment>
          <div className={`post-${id}`}>
         
 {/* Bannière */}
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

         

          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} />

          </React.Fragment>
          <p role="button" className="download" onClick={() => window.print()}>
        Télécharger le cv
      </p>
          </SimpleReactLightbox>
        )
      }
      


export default WpPost;


export const query = graphql`
  query ($id: String) {
    wpPost(id: { eq: $id }) {
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
  }
`

