import {
  createGlobalTheme,
  createTheme,
  createThemeContract,
} from "@vanilla-extract/css"

const root = createGlobalTheme("#app", {
  space: {
    small: "4px",
    medium: "8px",
    large: "16px",
  },
  fonts: {
    heading: "Georgia, Times, Times New Roman, serif",
    body: "system-ui",
  },
})

const colors = createThemeContract({
  primary: "",
  secondary: "",
  background: "",
  text: {
    normal: "",
    dimmed: "",
  },
})

export const lightTheme = createTheme(colors, {
  primary: "#1E40AF",
  secondary: "#DB2777",
  background: "#EFF6FF",
  text: {
    normal: "#1F2937",
    dimmed: "#6B7280",
  },
})

// export const darkTheme = createTheme(colors, {
//   primary: "#60A5FA",
//   secondary: "#F472B6",
//   background: "#1F2937",
//   text: {
//     normal: "#F9FAFB",
//     dimmed: "#D1D5DB"
//   }
// });

// export const vars = { ...root, colors }
