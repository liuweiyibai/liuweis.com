/** @jsx jsx */
import { jsx, Box, Flex } from "theme-ui"
import { Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { motion, usePresence, MotionProps, useWillChange } from "framer-motion"

type BlogListItemProps = {
  post: {
    node: {
      excerpt: string
      fields: {
        slug: string
      }
      frontmatter: {
        title: string
        date: string
        category?: string[]
        thumbnail?: any
      }
    }
  }
}

const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 }

const BlogListItem = ({ post }: BlogListItemProps) => {
  const [isPresent, safeToRemove] = usePresence()
  const willChange = useWillChange()
  const animations: MotionProps = {
    layout: true,
    initial: "out",
    style: {
      position: isPresent ? "static" : "absolute",
    },
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0, zIndex: -1 },
      tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  }

  const image = getImage(post.node.frontmatter?.thumbnail)
  const title = post.node.frontmatter.title
  return (
    <motion.div {...animations} style={{ willChange }}>
      <Flex mb={4} sx={{ alignItems: "center" }}>
        {image && <GatsbyImage sx={{ mr: 3 }} image={image} alt={title} />}
        <Box sx={{ pt: 2, pb: 2 }}>
          <Link
            to={post.node.fields.slug}
            sx={(t) => ({
              ...t.styles?.a,
              fontSize: ["lg", "xl", "2xl"],
              color: `text`,
              mb: 1,
              display: "block",
            })}
          >
            {title}
          </Link>
          <p
            sx={{
              color: `secondary`,
              m: 0,
              a: { color: `secondary` },
              fontSize: ["xs", "sm", "default"],
            }}
          >
            <time>{post.node.frontmatter.date}</time>
          </p>
        </Box>
      </Flex>
    </motion.div>
  )
}

export default BlogListItem
