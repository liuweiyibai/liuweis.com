/** @jsx jsx */
import { graphql } from "gatsby"
// import { Helmet } from "react-helmet"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "../components/mdx-components"
import { Box, Heading, jsx } from "theme-ui"
import { codeStyles } from "../styles/code"
import Layout from "../layout"

const BlogPost = ({ children, ...props }) => {
  const { pageContext } = props
  const { title } = pageContext.frontmatter
  return (
    <Layout>
      <MDXProvider components={MdxComponents}>
        <Box as="main" sx={codeStyles}>
          <Heading
            as="h1"
            variant="styles.h1"
            sx={{
              fontWeight: 900,
            }}
          >
            {title}
          </Heading>
          <section sx={{ my: 5, variant: `layout.content` }}>
            {children}
          </section>
        </Box>
      </MDXProvider>
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query PageDetail($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
