const React = require("react")
const BackGround = require("./src/components/background")

exports.onRenderBody = ({
  setHeadComponents,
  setPreBodyComponents,
  setBodyAttributes,
  setPostBodyComponents,
}) => {
  setHeadComponents([
    <link
      as="script"
      rel="preload"
      href="/scripts/preloader.js"
      key="preload-script"
    />,
    <noscript key="no-script">
      <link rel="stylesheet" href="/styles/noscript.css" />
    </noscript>,
  ])
  setPreBodyComponents([
    <div id="preloader" key="preloader">
      <div className="contain">
        <div className="second"></div>
        <div className="third"></div>
        <div className="text">Loading...</div>
      </div>
    </div>,
  ])
  setBodyAttributes({ className: "preloader_active" })
  setPostBodyComponents([
    <script src="/scripts/preloader.js" key="script-preloader" />,
  ])
}

// exports.wrapPageElement = ({ element, props }) => {
//   return (
//     <>
//       {element}
//       <BackGround />
//     </>
//   )
// }
