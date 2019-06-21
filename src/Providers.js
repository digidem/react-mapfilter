// @flow
import * as React from 'react'
import isEqualShallow from 'is-equal-shallow'
import {
  FieldnameTranslationProvider,
  ValueTranslationProvider,
  SettingsProvider,
  FieldTypesProvider,
  FieldOrderProvider,
  ResizerProvider,
  defaultSettings
} from './internal/Context'

export {
  FieldnameTranslationProvider,
  ValueTranslationProvider,
  SettingsProvider,
  FieldTypesProvider,
  FieldOrderProvider,
  ResizerProvider
}

type Props = {
  fieldnameTranslations?: {},
  valueTranslations?: {},
  settings: typeof defaultSettings,
  fieldTypes: {},
  fieldOrder: {},
  resizer: string => string,
  children: React.Node
}

// We need these defaults to have equality between renders, otherwise every
// render the object literal `{}` would appear as a new value and force a
// re-render of components that consume this context
const EMPTY_OBJECT = {}
const noop = x => x

/* Optional config for react-mapfilter */
const Provider: React.StatelessFunctionalComponent<Props> = ({
  fieldnameTranslations = EMPTY_OBJECT,
  valueTranslations = EMPTY_OBJECT,
  settings = defaultSettings,
  fieldTypes = EMPTY_OBJECT,
  fieldOrder = EMPTY_OBJECT,
  resizer = noop,
  children
}) => {
  // Avoid mutating settings (because it would force a re-render on context see
  // https://reactjs.org/docs/context.html#caveats) and apply defaults for
  // missing settings
  settings = isEqualShallow(settings, defaultSettings)
    ? settings
    : { ...defaultSettings, ...settings }
  return (
    <FieldnameTranslationProvider value={fieldnameTranslations}>
      <ValueTranslationProvider value={valueTranslations}>
        <SettingsProvider value={settings}>
          <FieldTypesProvider value={fieldTypes}>
            <FieldOrderProvider value={fieldOrder}>
              <ResizerProvider value={resizer}>{children}</ResizerProvider>
            </FieldOrderProvider>
          </FieldTypesProvider>
        </SettingsProvider>
      </ValueTranslationProvider>
    </FieldnameTranslationProvider>
  )
}

export default Provider
