import assign from 'object-assign'

import {
  FORMATS_UTM,
  FORMATS_DEC_DEG,
  FORMATS_DEG_MIN_SEC
} from '../constants'

const defaultSettings = {
  coordFormat: FORMATS_DEC_DEG
}

const isValidFormat = {
  [FORMATS_UTM]: true,
  [FORMATS_DEC_DEG]: true,
  [FORMATS_DEG_MIN_SEC]: true
}

const settings = (state = defaultSettings, {type, payload}) => {
  switch (type) {
    case 'CHANGE_COORDINATE_FORMAT':
      if (!isValidFormat[payload]) {
        console.warn('`' + payload + '` is not a valid coordinate format')
        return state
      }
      return assign({}, state, {
        coordFormat: payload
      })

    default:
      return state
  }
}

export default settings
