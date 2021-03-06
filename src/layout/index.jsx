import React from "react"
import FixedBtn from "../components/fixed-btn"
import Background from "../components/background"

import { Top } from "../components/top"
import { Header } from "../components/header"
import { ThemeSwitch } from "../components/theme-switch"
import { Footer } from "../components/footer"
import { rhythm } from "../utils/typography"

import "./index.scss"

export class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <React.Fragment>
        <Top title={title} location={location} rootPath={rootPath} />
        <div
          style={{
            marginLeft: `auto`,
            marginRight: `auto`,
            maxWidth: rhythm(26),
            padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
          }}
        >
          <ThemeSwitch />
          <Header title={title} location={location} rootPath={rootPath} />
          {children}
          <Footer />
          <FixedBtn />
          <Background />
        </div>
      </React.Fragment>
    )
  }
}
