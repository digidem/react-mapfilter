#!/usr/bin/env node

const extract = require('@digidem/extract-react-intl-messages')

const LOCALES = ['en', 'es', 'fr', 'pt']
const COMPONENT_NAMES = [
  'ReportView',
  'MapView',
  'MediaView',
  'ObservationDialog',
  'FilterPanel'
]

const opts = {
  defaultLocale: 'en',
  descriptions: true
}

// Public exported components should each be in a top-level folder under `src`.
// Exports the translations for each component separately.
;(async function() {
  await COMPONENT_NAMES.map(componentName => {
    const pattern = `src/${componentName}/**/!(*.test|*.stories).js`
    return extract(LOCALES, pattern, 'messages/' + componentName, opts)
  })
})()

extract(LOCALES, 'src/messages.js', 'messages/shared', opts)
