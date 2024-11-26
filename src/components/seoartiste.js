import React from "react";
import { Helmet } from "react-helmet";

const SEOArtiste = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/images/favicon.jpg" type="image/x-icon" />
    </Helmet>
  );
};

export default SEOArtiste;
