/** @jsx jsx */
import { jsx, useColorMode } from "theme-ui"
import { useCallback, useRef } from "react"
import { Item } from "./item"

const CategoryBox = ({ categories, category, selectCategory }) => {
  const containerRef = useRef(null)
  const [colorMode, _setColorMode] = useColorMode<"light" | "dark">()
  const isDark = colorMode === `dark`
  const scrollToCenter = useCallback(
    (tabRef) => {
      const { offsetWidth: tabWidth } = tabRef.current
      const { scrollLeft, offsetWidth: containerWidth } = containerRef.current
      const tabLeft = tabRef.current.getBoundingClientRect().left
      const containerLeft = containerRef.current.getBoundingClientRect().left
      const refineLeft = tabLeft - containerLeft
      const targetScollX =
        scrollLeft + refineLeft - containerWidth / 2 + tabWidth / 2

      containerRef.current.scroll({
        left: targetScollX,
        top: 0,
        behavior: "smooth",
      })
    },
    [containerRef]
  )

  return (
    <ul
      ref={containerRef}
      role="tablist"
      id="category"
      sx={{
        position: "sticky",
        top: "8px",
        lineHeight: 0,
        whiteSpace: "nowrap",
        overflowX: "scroll",
        msOverflowStyle: "none", // IE 10+
        overflow: "-moz-scrollbars-none", // Firefox
        zIndex: 1,
        m: 0,
        boxSizing: "border-box",
        padding: "6px 20px",
        listStyle: "none",
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          display: "none", // Safari and Chrome
        },
        color: "heading",
        ...(isDark
          ? {
              borderTop: "1px solid rgb(56, 54, 54)",
              borderBottom: `1px solid rgb(56, 54, 54)`,
              borderRight: `6px solid rgb(56, 54, 54)`,
              borderLeft: "6px solid rgb(56, 54, 54)",
              backgroundColor: " #24272c",
              ">li": {
                border: " 1px solid rgb(56, 54, 54)",
                backgroundColor: "#282c35",
                WebkitBoxShadow: "0px 1px 1px rgba(255, 255, 255, 0.1)",
                boxShadow: "0px 1px 1px rgba(255, 255, 255, 0.1)",
                "&[aria-selected='true']": {
                  border: "2px solid #666",
                  fontWeight: "bolder",
                },
              },
            }
          : {
              borderTop: "1px solid #ecf0f2",
              borderBottom: `1px solid #ecf0f2`,
              borderRight: `6px solid #ecf0f2`,
              borderLeft: "6px solid #ecf0f2",
              backgroundColor: " #f4f7f8",
              ">li": {
                border: " 1px solid #ecf0f2",
                backgroundColor: "#fff",
                WebkitBoxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                "&[aria-selected='true']": {
                  border: "2px solid #909da1",
                  fontWeight: "bolder",
                },
              },
            }),
      }}
    >
      <Item
        title={"All"}
        selectedCategory={category}
        onClick={selectCategory}
        scrollToCenter={scrollToCenter}
      />
      {categories.map((title, idx) => (
        <Item
          key={idx}
          title={title}
          selectedCategory={category}
          onClick={selectCategory}
          scrollToCenter={scrollToCenter}
        />
      ))}
    </ul>
  )
}

export default CategoryBox
