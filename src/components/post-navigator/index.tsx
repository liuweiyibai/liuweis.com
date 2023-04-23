/** @jsx jsx */
import { ThemeUIStyleObject, jsx, useColorMode } from "theme-ui"
import { Link } from "gatsby"

const linkStyle: ThemeUIStyleObject = {
  padding: "7px 16px 8px 16px",
  borderRadius: "6px",
  fontSize: "12px",
  opacity: 0.8,
  backgroundColor: "#fceff7",
  color: "#cc007a",
  textDecoration: "none",
} as const

export const PostNavigator = ({ pageContext }) => {
  const { previous, next } = pageContext

  return (
    <ul
      sx={{
        margin: "40px 0",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        listStyle: "none",
        padding: 0,
        li: {
          mb: "12px",
        },
      }}
    >
      <li>
        {previous && (
          <Link to={previous.fields.slug} rel="prev" sx={linkStyle}>
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li>
        {next && (
          <Link to={next.fields.slug} rel="next" sx={linkStyle}>
            {next.frontmatter.title} →
          </Link>
        )}
      </li>
    </ul>
  )
}
