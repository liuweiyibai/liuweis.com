const React = require("react")

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
      <div className="loader">
        <span className="dot_1"></span>
        <span className="dot_2"></span>
        <span className="dot_3"></span>
      </div>
    </div>,
  ])
  setBodyAttributes({ className: "preloader_active" })
  setPostBodyComponents([
    <script src="/scripts/preloader.js" key="script-preloader" />,
  ])
}
