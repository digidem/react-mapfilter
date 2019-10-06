import React from 'react'
import { configure, addDecorator } from '@storybook/react'
// import { withInfo } from '@storybook/addon-info'
import { setIntlConfig, withIntl } from 'storybook-addon-intl'
// import { withPropsTable } from 'storybook-addon-react-docgen'

const translations = {
  ReportView: {
    en: require('../translations/en.json'),
    es: require('../translations/es.json'),
    fr: require('../translations/fr.json')
  }
}

const getMessages = locale => {
  return {
    ...translations.ReportView[locale]
  }
}

// Set intl configuration
setIntlConfig({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
  textComponent: React.Fragment,
  getMessages
})

// Register decorator
// addDecorator(withPropsTable)
addDecorator(withIntl)

// addDecorator((story, context) =>
//   withInfo({
//     header: false,
//     inline: true
//   })(story)(context)
// )

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module)
