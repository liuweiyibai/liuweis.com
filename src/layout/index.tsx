/** @jsx jsx */
import * as React from "react"
import { Container, jsx } from "theme-ui"
import { TopBox } from "./top-box"
import { PageProps } from "gatsby"
import ThemeSwitcher from "../components/theme-switcher"
import { TitleBox } from "./title-box"
import FooterCopyright from "../components/footer-copyright"
import HeadTag from "../components/head-tag"

type LayoutProps = {
  children: React.ReactNode
  className?: string
  title?: string
  location: PageProps["location"]
}

const Layout = ({ children, className = ``, ...props }: LayoutProps) => {
  const { location, title } = props as any
  const rootPath = `${__PATH_PREFIX__}/`
  const _props = {
    location,
    title,
    rootPath,
  }
  return (
    <React.Fragment>
      <HeadTag title={title} />
      <TopBox {..._props}></TopBox>
      <Container>
        <ThemeSwitcher />
        <TitleBox {..._props} />
        {children}
      </Container>
      <FooterCopyright />
      {/* <Background /> */}
    </React.Fragment>
  )
}

export default Layout
