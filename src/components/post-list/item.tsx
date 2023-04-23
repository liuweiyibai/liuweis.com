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
    <motion.h2 {...animations} style={{ willChange }}>
      <Flex mb={4} sx={{ alignItems: "center" }}>
        {image && <GatsbyImage sx={{ mr: 2 }} image={image} alt={title} />}
        <Box>
          <Link
            to={post.node.fields.slug}
            sx={(t) => ({
              ...t.styles?.a,
              fontSize: ["sm", "default", "2xl"],
              color: `text`,
            })}
          >
            {title}
          </Link>
          <p
            sx={{
              color: `secondary`,
              mt: 1,
              a: { color: `secondary` },
              fontSize: [1, 1, 2],
            }}
          >
            <time>{post.node.frontmatter.date}</time>
          </p>
        </Box>
      </Flex>
    </motion.h2>
  )
}

export default BlogListItem
