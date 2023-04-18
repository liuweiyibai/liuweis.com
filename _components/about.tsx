import * as React from "react"
import { graphql } from "gatsby"
import Layout from "./layout"
import * as sections from "./sections"
import Fallback from "./fallback"
import SEOHead from "./head"

interface AboutProps {
  data: {
    aboutPage: {
      id: string
      title: string
      description: string
      image: { id: string; url: string }
      blocks: sections.HomepageBlock[]
    }
  }
}

export default function About(props: AboutProps) {
  const { aboutPage } = props.data

  return (
    <Layout>
      {aboutPage ? (
        aboutPage.blocks.map((block) => {
          const { id, blocktype, ...componentProps } = block
          const Component = sections[blocktype] || Fallback
          return <Component key={id} {...(componentProps as any)} />
        })
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "100px",
          }}
        >
          <h1>Whoops! There should be About page content here.</h1>
          <div style={{ maxWidth: "700px" }}>
            <p>
              You're seeing this message because no <code>aboutPage</code>{" "}
              blocks were found in the about page query result. This is likely
              because you are using a free Contentful space where restrictions
              on the number of content types apply.
            </p>
            <p>
              Take a look at the repository <code>README</code> Quick Start
              section for a note on how to provision your Contentful space with
              the <code>aboutPage</code> content types included once you have a
              paid plan.
            </p>
          </div>
        </div>
      )}
    </Layout>
  )
}
export const Head = (props: AboutProps) => {
  const { aboutPage } = props.data
  return <SEOHead {...aboutPage} />
}
export const query = graphql`
  {
    aboutPage {
      id
      title
      description
      image {
        id
        url
      }
      blocks: content {
        id
        blocktype
        ...AboutHeroContent
        ...AboutStatListContent
        ...HomepageProductListContent
        ...AboutLeadershipContent
        ...HomepageBenefitListContent
        ...AboutLogoListContent
        ...HomepageCtaContent
      }
    }
  }
`
