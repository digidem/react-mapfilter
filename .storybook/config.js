/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { addDecorator, configure } from '@storybook/react'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'

const getMessages = function () {
  return {}
}

// Set intl configuration
setIntlConfig({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  getMessages
})

addDecorator(withIntl)

// See https://storybook.js.org/basics/writing-stories/#loading-stories-dynamically
const req = require.context('../stories', true, /\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
