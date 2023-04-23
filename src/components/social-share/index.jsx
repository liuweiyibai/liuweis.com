import React from "react"
import { FacebookIcon } from "./facebook-icon"
import { TwitterIcon } from "./twitter-icon"
import { shareToTwitter, shareToFacebook } from "../../util/share"

import "./index.scss"

export const SocialShare = ({ title, author }) => {
  const text = `"${title}" by ${author}(@liuweiyibai)`

  const onClickTwitterIcon = (e) => {
    e.preventDefault()

    return shareToTwitter(window.location.href, text)
  }

  const onClickFacebookIcon = (e) => {
    e.preventDefault()
    return shareToFacebook(window.location.href, text)
  }

  return (
    <div className="social-share">
      <FacebookIcon onClick={onClickFacebookIcon} />
      <TwitterIcon onClick={onClickTwitterIcon} />
    </div>
  )
}
