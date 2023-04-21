/** @jsx jsx */
import { jsx } from "theme-ui"

import { useRef, useCallback, useEffect } from "react"

export const Item = ({ title, selectedCategory, onClick, scrollToCenter }) => {
  const tabRef = useRef(null)

  const handleClick = useCallback(() => {
    scrollToCenter(tabRef)
    onClick(title)
  }, [tabRef])

  useEffect(() => {
    if (selectedCategory === title) {
      scrollToCenter(tabRef)
    }
  }, [selectedCategory, tabRef])

  return (
    <li
      ref={tabRef}
      role="tab"
      aria-selected={selectedCategory === title ? "true" : "false"}
      sx={{
        display: "inline-block",
        margin: " 0.25rem 6px 0.25rem 0",
        borderRadius: "15px",
        whiteSpace: "normal",
        boxSizing: "border-box",
      }}
    >
      <div
        onClick={handleClick}
        sx={{
          padding: "0 16px 0 16px",
          height: "30px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          boxSizing: "border-box",
          cursor: "pointer",
          "&:last0child": {
            marginRight: "0",
          },
        }}
      >
        {title}
      </div>
    </li>
  )
}
