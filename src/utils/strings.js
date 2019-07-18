// @flow
import type { Field } from '../types'
import type { IntlShape } from 'react-intl'
/**
 * Either returns the translated user-defined label for a field, or creates a
 * label from the field key by replacing _ and - with spaces and formatting in
 * title case
 */
export function getFieldLabel(
  field: Field,
  intl: IntlShape
): string | string[] {
  const languageTag = intl.locale || 'en'
  // two-letter or three-letter ISO language code
  const languageCode = languageTag.split('-')[0]
  // choose most specific label translation available e.g. language tag with
  // country code first, then just language code, then label without language
  // specified
  const label =
    field['label:' + languageTag] ||
    field['label:' + languageCode] ||
    field.label
  if (label) return label
  const fieldkey = typeof field.key === 'string' ? [field.key] : [...field.key]
  const labelArray = fieldkey.map(s => titleCase(s + ''))
  return labelArray.length === 1 ? labelArray[0] : labelArray
}

export function sentenceCase(str: string = '') {
  // Matches the first letter in the string and the first letter that follows a
  // period (and 1 or more spaces) and transforms that letter to uppercase.
  return str.replace(/(^[a-z])|(\.\s*[a-z])/g, str => str.toUpperCase())
}

/**
 * For a string written in camel_case or snake-case, or space-separated, return
 * string formatted in title case
 */
export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(/\s|_|-/)
    .map(word => capitalize(word))
    .join(' ')
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
