/** @jsx jsx */
import { jsx } from "theme-ui"
const footerStyle = {
  pb: 4,
  pt: 3,
  textAlign: "center",
  fontSize: "default",
  a: {
    textDecoration: "none",
    color: "primary",
  },
} as const

const FooterCopyright = () => (
  <footer sx={footerStyle}>
    ©2017-{new Date().getFullYear()}
    <a href="//github.com/liuweiyibai" target="_blank">
      &nbsp;刘威益佰&nbsp;
    </a>
    Powered by
    <a href="//github.com/gatsbyjs/gatsby" target="_blank">
      &nbsp;Gatsby
    </a>
  </footer>
)
export default FooterCopyright
