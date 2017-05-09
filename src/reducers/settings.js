import assign from 'object-assign'

const defaultSettings = {
  coordFormat: 'lonlat'
}

const isValidFormat = {
  lonlat: true,
  utm: true
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
