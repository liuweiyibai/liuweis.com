import remarkGfm from "remark-gfm"
import rehypeMetaAsAttributes from "@lekoarts/rehype-meta-as-attributes"
import metaConfig from "./config/meta.mjs"

export default {
  siteMetadata: metaConfig,
  plugins: [
    `gatsby-plugin-sass`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /src/,
        },
      },
    },
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-transformer-sharp",

    // {
    //   resolve: "gatsby-plugin-manifest",
    //   options: {
    //     name: "Gatsby Starter Contentful Homepage",
    //     short_name: "Gatsby",
    //     start_url: "/",
    //     background_color: "#ffe491",
    //     theme_color: "#004ca3",
    //     icon: "src/favicon.png",
    //   },
    // },

    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeMetaAsAttributes],
        },
        extensions: [`.md`, `.mdx`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-images-medium-zoom`,
            options: {
              margin: 12,
              scrollOffset: 0,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },

          // `gatsby-remark-copy-linked-files`,
          // `gatsby-remark-smartypants`,
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-emoji`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content`,
        name: `content`,
      },
    },

    {
      resolve: "gatsby-plugin-page-progress",
      options: {
        includePaths: ["/", { regex: "^/blog" }],
        excludePaths: ["/blog/beep-beep-lettuce"],
        height: 8,
        prependToBody: true,
        color: `#663399`,
        footerHeight: 500,
        headerHeight: 0,
      },
    },
  ],
}
