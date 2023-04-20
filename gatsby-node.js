const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { redirectTable } = require("./gatsby-meta-config")

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`./src/templates/blog-post.tsx`)

  return graphql(
    `
      {
        allMdx(
          limit: 2
          sort: { frontmatter: { date: DESC } }
          filter: { frontmatter: { draft: { eq: false } } }
        ) {
          edges {
            node {
              id
              internal {
                contentFilePath
              }
              frontmatter {
                title
                date(formatString: "YYYY/MM/DD HH:mm:ss")
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `
  ).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMdx.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: `${blogPostTemplate}?__contentFilePath=${post.node.internal.contentFilePath}`,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField, createRedirect } = actions

  if (redirectTable) {
    redirectTable.forEach(({ fromPath, toPath }) =>
      createRedirect({
        fromPath,
        toPath,
        isPermanent: true,
        redirectInBrowser: true,
      })
    )
  }

  if (node.internal.type === `Mdx`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
      slug: value,
    })
  }
}
