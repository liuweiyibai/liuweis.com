// custom typefaces
require("typeface-noto-sans-kr")
require("typeface-catamaran")

// polyfill
require("intersection-observer")

const { SideBarBtns } = require("./src/utils/side-bar-btns")

exports.onRouteUpdate = () => {
  /** The SideBarBtns object is created */
  let sidebarbtns = new SideBarBtns()
  /** If the current page is an article page */
  if (document.getElementById("scroll-btn")) {
    /** The SideBarBtns object is initialized */
    sidebarbtns.Initialize()
  }
}
