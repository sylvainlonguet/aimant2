/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `.:: aimant ::: agence artistique ::.`,
    description: `.:: aimant ::: agence artistique ::.`,
    author: `François Tessier`,
    siteUrl: `https://cms.aimant.art/`,
    image: `aimant_logo.png`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-wordpress",
      options: {
        url: "https://cms.aimant.art/graphql",
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
  ],
};
