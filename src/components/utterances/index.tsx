/** @jsx jsx */
import { jsx } from "theme-ui"
import { useEffect } from "react"
import { useColorMode } from "theme-ui"
import React from "react"

const src = "https://utteranc.es/client.js"
const branch = "master"
const DARK_THEME = "photon-dark"
const LIGHT_THEME = "github-light"

export const Utterances = ({ repo }) => {
  const rootElm = React.createRef<HTMLDivElement>()
  const [colorMode, _setColorMode] = useColorMode()
  useEffect(() => {
    const isDarkTheme = colorMode === "dark"
    const utterances = document.createElement("script")
    const utterancesConfig = {
      src,
      repo,
      branch,
      theme: isDarkTheme ? DARK_THEME : LIGHT_THEME,
      label: "comment",
      async: true,
      "issue-term": "pathname",
      crossorigin: "anonymous",
    }

    Object.keys(utterancesConfig).forEach((configKey) => {
      utterances.setAttribute(configKey, utterancesConfig[configKey])
    })
    rootElm.current.appendChild(utterances)
  }, [])

  return <div className="utterances" ref={rootElm} />
}
