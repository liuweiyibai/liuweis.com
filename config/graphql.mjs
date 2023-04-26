// 查询所有 md 列表
export const getAllMdx = `{
    allMdx(
        sort: {frontmatter: {date: DESC}}
        filter: {frontmatter: {draft: {ne: true}, category: {ne: null}}}
    ) {
    nodes {
      frontmatter {
        category
        date(formatString: "YYYY/MM/DD HH:mm:ss")
        title
      }
      excerpt(pruneLength: 200)
      fields {
        slug
      }
      internal {
        contentFilePath
      }
    }
  }
}
`
