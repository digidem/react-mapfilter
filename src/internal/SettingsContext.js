// @flow
import React from 'react'

import * as coordFormats from '../constants/coord_formats'

// type SettingsContext = {
//   coordFormat: $Values<typeof coordFormats>
// }

export const { Consumer, Provider } = React.createContext({
  coordFormat: coordFormats.UTM
})
