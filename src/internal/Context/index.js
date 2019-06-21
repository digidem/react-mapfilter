// @flow
import * as React from 'react'
import * as coordFormats from '../../constants/coord_formats'

import type { FieldTypes, FieldOrder } from '../../types'

/**
 * IMPORTANT: "The defaultValue argument is only used by a Consumer when it does
 * not have a matching Provider above it in the tree." - see
 * https://reactjs.org/docs/context.html#reactcreatecontext
 */

// type HOC<K> = <C: React.ComponentType<*>>(
//   C
// ) => React.ComponentType<$Diff<React.ElementConfig<C>, { [K]: any }>>

// type ConsumerType = React.ComponentType<{ children: (value: any) => any }>

function createWith(Consumer, key) {
  return function withContext<Props: {}>(
    Component: React.ComponentType<Props>
  ) {
    return function WithContextComponent(props: Props) {
      return (
        <Consumer>
          {value => <Component {...props} {...{ [key]: value }} />}
        </Consumer>
      )
    }
  }
}

export const {
  Provider: FieldnameTranslationProvider,
  Consumer: FieldnameTranslationConsumer
}: React.Context<{ [fieldname: string]: string }> = React.createContext({})
export const withFieldnameTranslations = createWith(
  FieldnameTranslationConsumer,
  'fieldnameTranslations'
)

type ValueTranslationContext = {
  [fieldname: string]: { [value: string]: string }
}
export const {
  Provider: ValueTranslationProvider,
  Consumer: ValueTranslationConsumer
}: React.Context<ValueTranslationContext> = React.createContext({})

type SettingsContext = {
  coordFormat: $Values<typeof coordFormats>
}
export const defaultSettings: SettingsContext = {
  coordFormat: coordFormats.UTM
}
export const {
  Provider: SettingsProvider,
  Consumer: SettingsConsumer
}: React.Context<SettingsContext> = React.createContext(defaultSettings)

type ResizerContextType = (url: string, size: number) => string
export const ResizerContext: React.Context<ResizerContextType> = React.createContext(
  (url, size) => url
)

export const {
  Provider: FieldTypesProvider,
  Consumer: FieldTypesConsumer
}: React.Context<FieldTypes> = React.createContext({})

export const {
  Provider: FieldOrderProvider,
  Consumer: FieldOrderConsumer
}: React.Context<FieldOrder> = React.createContext({})
