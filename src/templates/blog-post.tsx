/** @jsx jsx */
import { graphql, PageProps } from "gatsby"
import { MDXProvider } from "@mdx-js/react"
import MdxComponents from "../components/mdx-components"
import { Box, Heading, jsx, Text } from "theme-ui"
import { codeStyles } from "../styles/code"
import Layout from "../layout"

const timeBlockStyle = {
  fontSize: "sm",
  fontStyle: "italic",
  color: "#7d7d7d",
} as const

const BlogPost: React.FC<React.PropsWithChildren<PageProps<any>>> = ({
  children,
  ...props
}) => {
  const { pageContext, data } = props as any
  const siteTitle = data?.site?.siteMetadata?.title
  const { date } = pageContext
  const { title } = pageContext.frontmatter
  return (
    <Layout location={props.location} title={siteTitle}>
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
    </Layout>
  )
}

export default BlogPost

export const query = graphql`
  query PageDetail($slug: String!) {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
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
