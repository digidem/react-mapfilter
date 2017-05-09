const visibleFields = (state = null, {type, payload}) => {
  switch (type) {
    case 'UPDATE_VISIBLE_FIELDS':
      return payload

    default:
      return state
  }
}

export default visibleFields
