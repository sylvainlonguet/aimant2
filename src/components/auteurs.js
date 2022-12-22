import  React from "react"
import { graphql } from "gatsby"


export default function Auteurs({ data }) {

   // const comediennes = data.wpgraphql.posts.nodes.filter(
    //   (p) => parseInt(p.categories.edges[0].node.categoryId, 10) === 2,
    // );

  console.log(data)
  return (
    <div>
      <h1>AUTEURS</h1>
      
      <h4>Posts</h4>
     
  </div>
  )
}

export const pageQuery = graphql`
  query {
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