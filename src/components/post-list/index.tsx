/** @jsx jsx */
import { jsx } from "theme-ui"
import BlogListItem from "./item"
import { AnimatePresence } from "framer-motion"
import { useMemo } from "react"
import { CATEGORY_TYPE } from "../../constants"

type ListingProps = {
  posts: {
    node: {
      excerpt: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        date: string
        thumbnail?: any
        category?: string[]
      }
    }
  }[]
  className?: string
  category?: string
  countOfInitialPost?: number
  count?: number
}

const Listing = ({
  posts,
  countOfInitialPost,
  count,
  category,
  className = ``,
}: ListingProps) => {
  const refinedPosts = useMemo(
    () =>
      posts
        .filter(
          ({ node }) =>
            category === CATEGORY_TYPE.ALL ||
            node.frontmatter.category.includes(category)
        )
        .slice(0, count * countOfInitialPost),
    [category, count]
  )

  return (
    <section className={className}>
      <AnimatePresence>
        {refinedPosts.map((post) => (
          <BlogListItem key={post.node.fields.slug} post={post} />
        ))}
      </AnimatePresence>
    </section>
  )
}

export default Listing
