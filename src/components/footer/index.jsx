import React from 'react'

import './index.scss'

export const Footer = () => (
  <footer className="footer">
    ©2017-{new Date().getFullYear()}{' '}
    <a href="//github.com/liuweiyibai">刘威益佰</a> Powered by{' '}
    <a href="//github.com/gatsbyjs/gatsby">Gatsby</a> Theme Bee
  </footer>
)
