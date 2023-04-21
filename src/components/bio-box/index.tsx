/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql, useStaticQuery } from "gatsby"
import Avatar from "../avatar"
import { keyframes } from "@emotion/react"
import { Link, Paragraph } from "theme-ui"

const flutter = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "35%": {
    transform: "rotate(0deg)",
  },
  "40%": {
    transform: "rotate(-5deg)",
  },
  "60%": {
    transform: "rotate(5deg)",
  },
  "65%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(0deg)",
  },
})

const authorDescription = {
  display: "flex",
  position: "relative",
  alignItems: "center",
  "&::before": {
    position: "absolute",
    zIndex: "999",
    background: 'url("/images/crown.png")',
    display: "inline-block",
    width: "32px",
    backgroundSize: "contain",
    height: "32px",
    content: "''",
    transform: "rotate(-37deg)",
    top: "-9px",
    left: "-15px",
  },
  a: {
    marginRight: "8px",
    fontSize: "80%",
    "&.visited": {
      textDecoration: "none",
    },
  },
} as const

const bioQuery = graphql`
  query BioQuery {
    site {
      siteMetadata {
        author
        introduction
        email
        social {
          twitter
          github
          medium
          facebook
        }
      }
    }
  }
`

export const Bio = () => {
  const data = useStaticQuery(bioQuery)
  const { author, social, introduction, email } = data.site.siteMetadata
  return (
    <div sx={{ mb: "24px" }}>
      <div sx={authorDescription}>
        <Avatar />
        <div>
          <span sx={{ fontSize: "90%", marginRight: "4px", color: "heading" }}>
            Written by
          </span>
          <Link
            href={`mailto:${email}`}
            sx={{
              display: "inline-block",
              fontSize: "95%",
              p: "2px 6px",
              fontWeight: "bolder",
              borderRadius: "8px",
              transformOrigin: "center",
              animation: `${flutter} 2s infinite linear`,
              backgroundColor: "aBackground",
            }}
            variant="links.secondary"
          >
            <span>@{author}</span>
          </Link>
          <div
            sx={{
              mt: "4px",
              fontSize: "80%",
              lineHeight: 1.4,
              variant: "styles.p",
              color: "heading",
            }}
          >
            {introduction}
          </div>
          <Paragraph
            sx={{ m: 0, mt: "4px", color: "heading" }}
            variant="styles.p"
          >
            {social.github && (
              <a href={`https://github.com/${social.github}`}>GitHub</a>
            )}
            {social.medium && (
              <a href={`https://medium.com/${social.medium}`}>Medium</a>
            )}
            {social.twitter && (
              <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>
            )}
            {social.facebook && (
              <a href={`https://www.facebook.com/${social.facebook}`}>
                Facebook
              </a>
            )}
          </Paragraph>
        </div>
      </div>
    </div>
  )
}

export default Bio
