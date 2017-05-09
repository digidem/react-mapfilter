import assign from 'object-assign'

const defaultFields = {
  media: null,
  title: null,
  subtitle: null,
  color: null
}

const fieldMapping = (state = defaultFields, {type, payload}) => {
  switch (type) {
    case 'UPDATE_FIELD_MAPPING':
      if (!(payload.type in defaultFields)) {
        console.warn('`' + payload.type + '` is not a valid field type')
        return state
      }
      return assign({}, state, {
        [payload.type]: payload.field
      })

    default:
      return state
  }
}

export default fieldMapping
