// @flow
import * as React from 'react'
import { FormattedDate, FormattedTime } from 'react-intl'

import { coerceValue } from '../lib/data_analysis/value_types'
import * as fieldTypes from '../constants/field_types'
import * as valueTypes from '../constants/value_types'
import type { Primitive, Field } from '../types'

type Props = {
  value: Primitive | Array<Primitive>,
  fieldType: $ElementType<Field, 'type'>
}

/**
 * Format a value from a form, either by guessing the type or trying to coerce
 * the value to a type specified by `fieldType`. An optional `fieldkey` is used
 * to look up a translated value which can be passed by FieldnameTranslationProvider
 */
const FormattedValue = ({ value, fieldType }: Props) => {
  if (value === undefined || value === null) return null
  try {
    switch (fieldType) {
      case fieldTypes.SELECT_MULTIPLE:
        const valueAsArray = coerceValue(value, valueTypes.ARRAY).filter(
          v => v != null
        )
        const values = valueAsArray.map<React.Node>((v, i) => (
          <FormattedValue key={i} value={v} fieldType={fieldTypes.TEXT} />
        ))
        return joinReactChildren(values, ', ')
      case fieldTypes.NUMBER:
        const valueAsNumber = coerceValue(value, valueTypes.NUMBER)
        return valueAsNumber + ''
      case fieldTypes.TEXT:
      case fieldTypes.SELECT_ONE:
        if (typeof value === 'boolean') return value ? 'yes' : 'no'
        const valueAsString = coerceValue(value, valueTypes.STRING)
        return valueAsString
      case fieldTypes.DATE:
        const valueAsDate = coerceValue(value, valueTypes.DATE)
        return (
          <FormattedDate
            value={valueAsDate}
            year="numeric"
            month="long"
            day="2-digit"
          />
        )
      case fieldTypes.DATETIME:
        const valueAsDatetime = coerceValue(value, valueTypes.DATETIME)
        return (
          <FormattedTime
            value={valueAsDatetime}
            year="numeric"
            month="long"
            day="2-digit"
          />
        )
      case fieldTypes.LINK:
        const valueAsUrl = coerceValue(value, valueTypes.URL)
        return (
          <a href={valueAsUrl} target="_blank" rel="noopener noreferrer">
            {valueAsUrl}
          </a>
        )
    }
    return null
  } catch (e) {
    const valueAsString = coerceValue(value, valueTypes.STRING)
    return valueAsString || null
  }
}

export default FormattedValue

function joinReactChildren(
  children: Array<React.Node>,
  separator: React.Node
): Array<React.Node> {
  const joinedChildren = []
  for (let i = 0; i < children.length; i++) {
    joinedChildren.push(children[i])
    if (i < children.length - 1) joinedChildren.push(separator)
  }
  return joinedChildren
}
