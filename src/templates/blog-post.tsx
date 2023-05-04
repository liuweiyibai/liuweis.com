/** @jsx jsx */
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "../components/mdx-components"
import { Box, Heading, jsx, Text } from "theme-ui"
import { codeStyles } from "../styles/code"
import Layout from "../layout"
import { SocialShare } from "../components/social-share"
import { SponsorButton } from "../components/sponsor-button"
import { RevueButton } from "../components/revue-button"
import LineBox from "../components/line-box"
import BioBox from "../components/bio-box"
import { PostNavigator } from "../components/post-navigator"
import { Utterances } from "../components/utterances"
import { useEffect } from "react"
import * as ScrollManager from "../util/scroll"
import * as React from "react"

const timeBlockStyle = {
  fontSize: "sm",
  fontStyle: "italic",
  color: "#7d7d7d",
} as const

const BlogPost: React.FC<React.PropsWithChildren<PageProps<any>>> = ({
  children,
  ...props
}) => {
  useEffect(() => {
    ScrollManager.init()
    return () => ScrollManager.destroy()
  }, [])
  const { pageContext, data } = props as any
  const {
    title: siteTitle,
    author,
    comment,
    sponsor,
    revueId,
  } = data?.site?.siteMetadata
  const { utterances } = comment
  const { date } = data.mdx.frontmatter
  const { title } = pageContext.frontmatter
  return (
    <Layout location={props.location} title={title}>
      <MDXProvider components={MdxComponents}>
        <Box as="main" sx={codeStyles}>
          <Heading as="h1" variant="styles.h1" sx={{ fontWeight: 900, mb: 3 }}>
            {title}
          </Heading>
          <Text sx={timeBlockStyle}>{date}</Text>
          <section sx={{ my: 5, variant: `layout.content` }}>
            {children}
          </section>
        </Box>
      </MDXProvider>

      <SocialShare title={siteTitle} author={author} />
      <div sx={{ display: "flex", justifyContent: "flex-end" }}>
        {!!sponsor.buyMeACoffeeId && (
          <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
        )}
        {revueId != null ? <RevueButton revueId={revueId} /> : null}
      </div>
      <LineBox />
      <BioBox />
      <PostNavigator pageContext={pageContext} />
      {!!utterances && <Utterances repo={utterances} />}
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query PageDetail($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
        revueId
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      id
      fields {
        slug
      }
      frontmatter {
        date(formatString: "YYYY/MM/DD HH:mm")
      }
    }
  }
`
