import * as React from "react"
import { useColorMode } from "theme-ui"
import {
  calculateLinesToHighlight,
  getLanguage,
  GetLanguageInput,
} from "@lekoarts/themes-utils"
import CopyButton from "../copy-button"
import { lightTheme, darkTheme } from "../../utils/prism-themes"
import LazyHighlight from "../lazy-high-light"

type CodeProps = {
  codeString: string
  withLineNumbers?: boolean
  highlight?: string
  title?: string
  className: GetLanguageInput
}

const CodeBlock = ({
  codeString,
  withLineNumbers = false,
  title = ``,
  className: blockClassName,
  highlight = ``,
}: CodeProps) => {
  const showCopyButton = true
  const [colorMode] = useColorMode<"light" | "dark">()
  const isDark = colorMode === `dark`

  const language = getLanguage(blockClassName)
  const shouldHighlightLine = calculateLinesToHighlight(highlight)
  const shouldShowLineNumbers = withLineNumbers || false

  return (
    <LazyHighlight
      code={codeString}
      language={language}
      theme={isDark ? darkTheme : lightTheme}
    >
      {({ className, tokens, getLineProps, getTokenProps }) => (
        <React.Fragment>
          <div className="gatsby-highlight" data-language={language}>
            {title && (
              <div className="code-title">
                <div>{title}</div>
              </div>
            )}
            <pre className={className} data-linenumber={shouldShowLineNumbers}>
              {showCopyButton && (
                <CopyButton content={codeString} fileName={title} />
              )}
              <code className={`code-content language-${language}`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i })

                  if (shouldHighlightLine(i)) {
                    lineProps.className = `${lineProps.className} highlight-line`
                    lineProps.style = {
                      ...lineProps.style,
                      backgroundColor: `var(--theme-ui-colors-highlightLineBg)`,
                    }
                  }

                  return (
                    <div {...lineProps}>
                      {shouldShowLineNumbers && (
                        <span className="line-number-style">{i + 1}</span>
                      )}
                      {line.map((token, key) => (
                        <span {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  )
                })}
              </code>
            </pre>
          </div>
        </React.Fragment>
      )}
    </LazyHighlight>
  )
}

export default CodeBlock
