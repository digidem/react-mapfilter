import {UPDATE_HIDDEN_FIELDS} from '../constants'

const hiddenFields = (state = null, {type, payload}) => {
  switch (type) {
    case UPDATE_HIDDEN_FIELDS:
      return payload

    default:
      return state
  }
}

export default hiddenFields
