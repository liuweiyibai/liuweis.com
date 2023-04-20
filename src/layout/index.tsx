/** @jsx jsx */
import * as React from "react"
import { Helmet } from "react-helmet"
import { Container, jsx } from "theme-ui"
import { TopBox } from "./top-box"
import ThemeSwitcher from "../components/theme-switcher"
import { TitleBox } from "./title-box"
import FooterCopyright from "../components/footer-copyright"

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => {
  const props = {
    title: "baidu.com",
    location: "/",
    rootPath: "/",
  }
  return (
    <React.Fragment>
      <Helmet>
        <link
          rel="stylesheet"
          href="//cdn.jsdelivr.net/npm/lxgw-wenkai-lite-webfont@1.6.0/style.min.css"
        />
      </Helmet>
      <TopBox {...props}></TopBox>
      <Container>
        <ThemeSwitcher />
        <TitleBox {...props} />
        {children}
      </Container>
      <FooterCopyright />
    </React.Fragment>
  )
}

export default Layout
