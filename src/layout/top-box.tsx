/** @jsx jsx */
import * as React from "react"

import { Link } from "gatsby"
import { BsGithub } from "react-icons/bs"
import { jsx } from "theme-ui"
import { keyframes } from "@emotion/react"

const gradient = keyframes({
  "0%": {
    backgroundPosition: "0% 51%",
  },
  "50%": {
    backgroundPosition: "100% 50%",
  },
  "100%": {
    backgroundPosition: "0% 51%",
  },
})

const topStyle = {
  position: "relative",
  width: "100%",
  height: "60px",
  background: "bgGradient",
  zIndex: 1000,
  backgroundSize: "800% 800%",
  animation: `${gradient} 15s ease infinite`,
  ".link": {
    display: "inline-block",
    fontSize: "3xl",
    pt: 1,
    ml: "20px",
    color: "#fff",
    opacity: 0.7,
    fontFamily: "body",
    fontWeight: 800,
    textDecoration: "none",
  },
} as const

const iconStyle = {
  float: "right",
  px: 4,
  mt: "11px",
  opacity: 0.6,
  fontSize: "3xl",
  color: "#fff",
} as const

const topLineStyle = {
  position: "sticky",
  top: "0px",
  height: "8px",
  background: "bgGradient",
  zIndex: 1000,
  backgroundSize: "400% 400%",
} as const

export const TopBox = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath

  return (
    <React.Fragment>
      <div sx={{ ...topStyle }}>
        {!isRoot && (
          <Link to={`/`} className="link">
            {title}
          </Link>
        )}
        <div sx={{ ...iconStyle }}>
          <BsGithub />
        </div>
      </div>
      <div sx={{ ...topLineStyle }} />
    </React.Fragment>
  )
}
