function sentenceCase (s = '') {
  // Matches the first letter in the string and the first letter that follows a
  // period (and 1 or more spaces) and transforms that letter to uppercase.
  return s.replace(/(^[a-z])|(\.\s*[a-z])/g, function (s) { return s.toUpperCase() })
}

function t (s = '') {
  return sentenceCase(s.replace(/_/g, ' '))
}

module.exports = {
  sentenceCase,
  t
}
