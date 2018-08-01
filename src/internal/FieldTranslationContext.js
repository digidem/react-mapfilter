// @flow

import * as React from 'react'

// type FieldTranslationContext = {
//   fieldnameTranslations: { [fieldname: string]: string },
//   valueTranslations: { [fieldname: string]: { [value: string]: string } }
// }

const { Consumer, Provider } = React.createContext({
  fieldnameTranslations: {},
  valueTranslations: {}
})

export { Consumer, Provider }
