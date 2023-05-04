import * as React from "react"
import { Helmet } from "react-helmet"
import { graphql, useStaticQuery } from "gatsby"

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        keywords
      }
    }
  }
`
type HeadTagProps = {
  description?: string
  lang?: string
  meta?: any[]
  keywords?: string[]
  title?: string
  thumbnail?: string
}
const HeadTag = ({
  description,
  lang = "zh_Hans",
  meta = [],
  keywords = [],
  title,
  thumbnail,
}: HeadTagProps) => {
  const data = useStaticQuery(detailsQuery)
  const metaDescription = description || data.site.siteMetadata.description
  const _keywords =
    (keywords.length ? keywords : data.site.siteMetadata.keywords) || []
  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      titleTemplate={`%s | ${data.site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:image`,
          content: thumbnail,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: data.site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: thumbnail,
        },
      ]
        .concat({
          name: `keywords`,
          content: _keywords.join(`, `),
        })
        .concat(meta)}
    />
  )
}

export default HeadTag
