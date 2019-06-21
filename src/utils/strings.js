// @flow
import { defineMessages } from 'react-intl'
import { NULL, UNDEFINED } from '../constants/value_types'

const msgs = defineMessages({
  true: 'Yes',
  false: 'No',
  null: '[No Value]',
  undefined: '[No Value]'
})

export function translateOrPretty(
  value: string | boolean | void | null,
  translations?: { [value: string]: string } = {}
): string {
  if (typeof value === 'boolean') {
    let valueString = value ? 'true' : 'false'
    return translations[valueString] || msgs[valueString].defaultMessage
  } else if (typeof value === 'undefined') {
    return translations.undefined || msgs.undefined.defaultMessage
  } else if (value === null) {
    return translations.null || msgs.null.defaultMessage
  }
  return translations[value] || titleCase(value.replace(/_/g, ' '))
}

export function sentenceCase(str: string = '') {
  // Matches the first letter in the string and the first letter that follows a
  // period (and 1 or more spaces) and transforms that letter to uppercase.
  return str.replace(/(^[a-z])|(\.\s*[a-z])/g, str => str.toUpperCase())
}

export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function t(str: string = '') {
  return sentenceCase(str.replace(/_/g, ' '))
}
