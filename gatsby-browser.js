require("lxgw-wenkai-webfont/style.css")
require("./src/styles/preloader.scss")
const React = require("react")
const BackGround = require("./src/components/background").default
const { init } = require("./src/components/background/Glass")

exports.wrapPageElement = ({ element, props }) => {
  return (
    <>
      {element}
      <BackGround />
    </>
  )
}
// exports.onClientEntry = () => {
//   window.addEventListener("load", () => {
//     init()
//   })
// }
