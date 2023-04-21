/** @jsx jsx */
import { Link } from "gatsby"
import { jsx, Heading } from "theme-ui"

const TitleBoxStyle = {
  mt: "0",
  borderBottom: "none",
  fontWeight: "black",
  fontSize: "5xl",
  letterSpacing: "tighter",
  color: `heading`,
  mb: 4,
  a: {
    color: "inherit",
    textDecoration: "none",
  },
} as const

export const TitleBox = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    isRoot && (
      <Heading as="h1" variant="styles.h1" sx={TitleBoxStyle}>
        <Link to="/">{title}</Link>
      </Heading>
    )
  )
}
