// @flow

export function translateOrPretty(
  fieldname: string = '',
  translations?: { [fieldname: string]: string } = {}
) {
  return translations[fieldname] || titleCase(fieldname.replace(/_/g, ' '))
}

export function sentenceCase(s: string = '') {
  // Matches the first letter in the string and the first letter that follows a
  // period (and 1 or more spaces) and transforms that letter to uppercase.
  return s.replace(/(^[a-z])|(\.\s*[a-z])/g, function(s) {
    return s.toUpperCase()
  })
}

export function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return capitalize(word)
    })
    .join(' ')
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function t(s: string = '') {
  return sentenceCase(s.replace(/_/g, ' '))
}
