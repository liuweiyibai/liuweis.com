import React, { useEffect } from "react"
import { graphql } from "gatsby"

import { Head } from "../components/head"
import { rhythm } from "../utils/typography"
import * as _ from "../constants"

import "../styles/resume.scss"

const AboutPage = ({ data }) => {
  const resumeData = data.site.siteMetadata.resume
  const resumes = data.allMarkdownRemark.edges
  const resume = resumes
    .filter(({ node }) => node.frontmatter.lang === _.ZH)
    .map(({ node }) => node)[0]

  useEffect(() => {
    console.log(
      `%c${_.ABOUT_HIDDEN_MESSAGE}`,
      `background: #2d8cf0; padding: 2px; border-radius: 4px;color: #fff;`
    )
  }, [])

  return (
    <>
      <Head
        title={resumeData.title}
        description={resumeData.description}
        thumbnail={resumeData.thumbnail}
      />
      <div
        className="about"
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(28),
          padding: `${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(
            3 / 4
          )}`,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: resume.html }} />
      </div>
    </>
  )
}
export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        resume {
          title
          description
          thumbnail
        }
      }
    }
    allMarkdownRemark(filter: { frontmatter: { category: { eq: null } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            lang
          }
        }
      }
    }
  }
`
