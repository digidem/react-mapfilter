import getBestFilterFields from './best_fields'

/**
 * If we have not configured a field to color, then use the
 * a guess at the best field to use for filtering
 */
const getColoredFieldName = state => {
  if (state.fieldMapping.color) {
    return state.fieldMapping.color
  } else {
    const bestFilterFields = getBestFilterFields(state)
    return bestFilterFields[0] && bestFilterFields[0].fieldname
  }
}

export default getColoredFieldName
