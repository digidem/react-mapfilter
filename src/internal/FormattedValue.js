// @flow
import * as React from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'

import { ValueTranslationContext } from './Context'
import { translateOrPretty } from '../utils/strings'

import * as fieldTypes from '../constants/field_types'
import type { SelectableFieldValue } from '../types'

export type FormattedValueProps =
  | {|
      fieldkey?: string,
      value: Date | null,
      fieldType: typeof fieldTypes.DATE
    |}
  | {|
      fieldkey?: string,
      value: Date | null,
      fieldType: typeof fieldTypes.DATETIME
    |}
  | {|
      fieldkey?: string,
      value: SelectableFieldValue,
      fieldType:
        | typeof fieldTypes.TEXT
        | typeof fieldTypes.LINK
        | typeof fieldTypes.SELECT_ONE
    |}
  | {|
      fieldkey?: string,
      value: number | null,
      fieldType: typeof fieldTypes.NUMBER
    |}
  | {|
      fieldkey?: string,
      value: Array<SelectableFieldValue>,
      fieldType: typeof fieldTypes.SELECT_MULTIPLE
    |}

/**
 * Format a value from a form, either by guessing the type or trying to coerce
 * the value to a type specified by `fieldType`. An optional `fieldkey` is used
 * to look up a translated value which can be passed by FieldnameTranslationProvider
 */
const FormattedValue = (props: FormattedValueProps) => {
  const translations = props.fieldkey
    ? React.useContext(ValueTranslationContext)[props.fieldkey]
    : {}

  if (props.fieldType === fieldTypes.DATE)
    if (props.value === undefined || props.value === null)
      return translateOrPretty(props.value, translations)
    else
      return (
        <FormattedDate
          value={props.value}
          year="numeric"
          month="long"
          day="2-digit"
        />
      )
  if (props.fieldType === fieldTypes.DATETIME)
    if (props.value === undefined || props.value === null)
      return translateOrPretty(props.value, translations)
    else
      return (
        <FormattedTime
          value={props.value}
          year="numeric"
          month="long"
          day="2-digit"
        />
      )
  else if (props.fieldType === fieldTypes.NUMBER)
    if (props.value === undefined || props.value === null)
      return translateOrPretty(props.value, translations)
    else return props.value + ''
  else if (props.fieldType === fieldTypes.LINK)
    return (
      <a href={props.value} target="_blank" rel="noopener noreferrer">
        {props.value}
      </a>
    )
  else if (
    props.fieldType === fieldTypes.TEXT ||
    props.fieldType === fieldTypes.SELECT_ONE
  )
    return translateOrPretty(props.value, translations)
  else if (props.fieldType === fieldTypes.SELECT_MULTIPLE)
    return props.value
      .map(item => translateOrPretty(item, translations))
      .join(', ')
  else return props.value
}

export default FormattedValue
