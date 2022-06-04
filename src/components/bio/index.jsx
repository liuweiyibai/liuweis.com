import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Avatar from '../avatar'
import './index.scss'

export const Bio = () => (
  <StaticQuery
    query={bioQuery}
    render={(data) => {
      const { author, social, introduction } = data.site.siteMetadata

      return (
        <div className="bio">
          <div className="author">
            <div className="author-description">
              <Avatar />
              <div className="author-name">
                <span className="author-name-prefix">Written by</span>
                <a href="mailto:lw1140@163.com" className="author-name-content">
                  <span>@{author}</span>
                </a>
                <div className="author-introduction">{introduction}</div>
                <p className="author-socials">
                  {social.github && (
                    <a href={`https://github.com/${social.github}`}>GitHub</a>
                  )}
                  {social.medium && (
                    <a href={`https://medium.com/${social.medium}`}>Medium</a>
                  )}
                  {social.twitter && (
                    <a href={`https://twitter.com/${social.twitter}`}>
                      Twitter
                    </a>
                  )}
                  {social.facebook && (
                    <a href={`https://www.facebook.com/${social.facebook}`}>
                      Facebook
                    </a>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }}
  />
)

const bioQuery = graphql`
  query BioQuery {
    # avatar: file(absolutePath: { regex: "/avatar.svg/" }) {
    #   childImageSharp {
    #     fixed(width: 72, height: 72) {
    #       ...GatsbyImageSharpFixed
    #     }
    #   }
    # }
    site {
      siteMetadata {
        author
        introduction
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

export default Bio
