import * as React from "react"
import { Text } from "theme-ui"
import { preToCodeBlock } from "../util"
import CodeBlock from "./code-block"
import TitleBlock from "./title-block"

const MdxComponents = {
  Text: (props) => <Text {...props} />,
  Title: (props) => <TitleBlock {...props} />,
  pre: (preProps) => {
    const props = preToCodeBlock(preProps)
    // if there's a codeString and some props, we passed the test
    if (props) {
      return <CodeBlock {...props} />
    }
    // it's possible to have a pre without a code in it
    return <pre {...preProps} />
  },
}

export default MdxComponents
