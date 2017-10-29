/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { addDecorator, configure } from '@storybook/react'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'

// Load the locale data for all your defined locales
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import esLocaleData from 'react-intl/locale-data/es'

addLocaleData(enLocaleData)
addLocaleData(esLocaleData)

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
