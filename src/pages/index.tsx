import * as React from "react"
import { PageProps, graphql } from "gatsby"
import Layout from "../layout"
import BioBox from "../components/bio-box"
import CategoryBox from "../components/category-box"
import { useCategory } from "../hooks/useCategory"
import { useRenderedCount } from "../hooks/useRenderedCount"
import { useIntersectionObserver } from "../hooks/useIntersectionObserver"
import { useScrollEvent } from "../hooks/useScrollEvent"
import { useMemo } from "react"
import _ from "lodash"
import * as Dom from "../util/dom"
import * as EventManager from "../util/event-manager"

const BASE_LINE = 80
function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

const IndexPage: React.FC<React.PropsWithChildren<PageProps<any>>> = ({
  location,
  ...props
}) => {
  const { title, configs } = props?.data?.site?.siteMetadata
  const { countOfInitialPost } = configs
  const posts = props?.data?.allMdx?.edges || []
  const [count, countRef, increaseCount] = useRenderedCount()
  const [category, selectCategory] = useCategory()
  const categories = useMemo(
    () => _.uniq(_.flatten(posts.map(({ node }) => node.frontmatter.category))),
    []
  )

  useIntersectionObserver()

  useScrollEvent(() => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(increaseCount, {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  })
  return (
    <Layout location={location} title={title}>
      <BioBox />
      <CategoryBox
        categories={categories}
        category={category}
        selectCategory={selectCategory}
      />
    </Layout>
  )
}

export default IndexPage

export const pageQuery = graphql`
  query MyQury {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMdx(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { draft: { ne: true }, category: { ne: null } } }
    ) {
      edges {
        node {
          frontmatter {
            title
            date(formatString: "YYYY/MM/DD HH:mm:ss")
            category
          }
          fields {
            slug
          }
          excerpt(pruneLength: 200)
        }
      }
    }
  }
`
