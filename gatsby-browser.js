require("lxgw-wenkai-webfont/style.css")
require("./src/styles/preloader.scss")
const React = require("react")
const BackGround = require("./src/components/background").default

exports.wrapPageElement = ({ element, props }) => {
  return (
    <>
      {element}
      <BackGround />
    </>
  )
}
