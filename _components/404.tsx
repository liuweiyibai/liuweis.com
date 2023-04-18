import * as React from "react"
import Layout from "./layout"
import { Container, Box, Heading, Text, Link, Flex } from "./ui"
import ChevronRight from "./chevron-right"
import * as styles from "./404.css"
import SEOHead from "./head"

export default function NotFound() {
  return (
    <Layout>
      <Box paddingY={4}>
        <Container>
          <Flex variant="column">
            <Heading variant="mega" className={styles.heading}>
              404
            </Heading>
            <Heading as="h1">Page not found</Heading>
            <Flex variant="column" gap={0}>
              <Text variant="lead" className={styles.text}>
                Sorry! We couldn’t find the page you were looking for.
              </Text>
              <Link to="/" className={styles.link}>
                <span>Back to home</span>
                <ChevronRight className={styles.linkChevron} />
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Layout>
  )
}
export const Head = () => {
  return <SEOHead title="404: Page not found" />
}
