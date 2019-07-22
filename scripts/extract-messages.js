#!/usr/bin/env node

const extract = require('@digidem/extract-react-intl-messages')

const LOCALES = ['en', 'es', 'fr']
const opts = {
  defaultLocale: 'en',
  descriptions: true
}

;(async function() {
  await ['ReportView'].map(componentName => {
    const pattern = `src/${componentName}/**/!(*.test|*.stories).js`
    return extract(LOCALES, pattern, 'messages/' + componentName, opts)
  })
})()

extract(LOCALES, 'src/messages.js', 'messages/shared', opts)
