// @flow
import * as React from 'react'
import * as coordFormats from '../constants/coord_formats'

import type { FieldOrder } from '../types'

export const FieldnameTranslationContext: React.Context<{
  [fieldname: string]: string
}> = React.createContext({})

type ValueTranslationContextType = {
  [fieldname: string]: { [value: string]: string }
}
export const ValueTranslationContext: React.Context<ValueTranslationContextType> = React.createContext(
  {}
)

type SettingsContextType = {
  coordFormat: $Values<typeof coordFormats>
}
export const defaultSettings: SettingsContextType = {
  coordFormat: coordFormats.UTM
}
export const SettingsContext: React.Context<SettingsContextType> = React.createContext(
  defaultSettings
)

type ResizerContextType = (url: string, size: number) => string
export const ResizerContext: React.Context<ResizerContextType> = React.createContext(
  (url, size) => url
)

export const {
  Provider: FieldOrderProvider,
  Consumer: FieldOrderConsumer
}: React.Context<FieldOrder> = React.createContext({})
