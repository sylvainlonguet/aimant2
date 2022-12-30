import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link }  from 'gatsby';


export default function Mes() {
  const data = useStaticQuery(graphql`
    query mesQuery {
        allWpPost(
        limit: 1000
        sort: {title: ASC}
        filter: {categories: {nodes: {elemMatch: {slug: {eq: "metteur-e-s-en-scene"}}}}}
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
    }
  }
    }
  `)




  return (
    <div className="grid-container">
    {data.allWpPost.nodes.map((c) => (
      <Link key={c.uri} to={c.uri}>
        <div className="grid-item">
          <div className="picture">
            {c.acf.mignature ? <img src={c.acf.mignature.sourceUrl} alt="photo" /> : ' '}
          </div>
          <p>{c.excerpt.replace(/<\/?[^>]*?>/gi, '')}</p>
        </div>
      </Link>
    ))}
    </div>
  )
}