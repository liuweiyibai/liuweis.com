/** @jsx jsx */
import { jsx } from "theme-ui"
import Aavatar from "../../assets/avatar.svg"
import { keyframes } from "@emotion/react"

const spin = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
})

const huerotate = keyframes({
  "0%": {
    filter: "hue-rotate(0deg)",
  },
  "50%": {
    filter: "hue-rotate(360deg)",
  },
})

const style = {
  width: "70px",
  height: "70px",
  overflow: "hidden",
  borderRadius: "50%",
  svg: {
    width: `100%`,
    height: `100%`,
    transition: `all 0.3s`,
    transitionTimingFunction: `ease`,
    "&:hover": {
      animation: `${huerotate}  10s infinite`,
    },
    polygon: {
      animation: `${spin} 8s linear infinite`,
      transformOrigin: `50% 50%`,
      "&:nth-of-type(2)": {
        animationDirection: "reverse",
      },
    },
  },
} as const

export default function () {
  return (
    <div sx={style}>
      <Aavatar />
    </div>
  )
}
