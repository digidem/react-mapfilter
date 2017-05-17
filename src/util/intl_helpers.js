import toCase from 'case'
import roundTo from 'round-to'
import {defineMessages} from 'react-intl'

const messages = defineMessages({
  true: {
    id: 'field_value.true',
    defaultMessage: 'Yes'
  },
  false: {
    id: 'field_value.false',
    defaultMessage: 'No'
  },
  null: {
    id: 'field_value.no_value',
    defaultMessage: '[No Value]'
  }
})

export const createMessage = section => function formatMsg (value) {
  let msg
  let id
  if (typeof value === 'string') {
    if (value.length === 0) return messages.null
    if (value.indexOf('_') > -1 && value.indexOf(' ') < 0) {
      msg = toCase.capital(value)
    } else {
      msg = toSentenceCase(value)
    }
    id = value.replace(' ', '_').toLowerCase()
  } else if (Array.isArray(value)) {
    msg = value.map(v => {
      if (typeof v === 'number') return roundTo(v, 5)
      return formatMsg(v).defaultMessage
    }).join(', ')
    id = value.join('_')
  } else if (typeof value === 'boolean') {
    if (value) return messages.true
    else return messages.false
  } else {
    if (value == null) {
      return messages.null
    } else {
      msg = value.toString()
      id = value.toString()
    }
  }
  return {
    id: section + '.' + id,
    defaultMessage: msg
  }
}

/**
 * toCase.sentence() lower cases strings before turning to sentence case.
 * toSentenceCase() uses the same logic, but without lowercasing first.
 */
function toSentenceCase (s) {
  var sentenceRegExp = toCase._.re.sentence
  return s.replace(sentenceRegExp, function (m, prelude, letter) {
    return prelude + letter.toUpperCase()
  })
}
