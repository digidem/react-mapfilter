import { createSelector } from 'reselect'

import getBestFilterFields from './best_fields'
import getFieldAnalysis from './field_analysis'
import getColoredFieldName from './colored_field'
import getDateFieldName from './date_field'
import getIdFieldNames from './id_fields'
import {FIELD_TYPES} from '../constants'

const getTitleFieldName = createSelector(
  getBestFilterFields,
  getDateFieldName,
  getIdFieldNames,
  (bestFilterFields, dateFieldName, idFieldNames) => {
    return (bestFilterFields[0] && bestFilterFields[0].fieldname) ||
      dateFieldName || idFieldNames[0] || 'No Title'
  }
)

const getSubtitleFieldName = (state) => {
  const bestFilterFields = getBestFilterFields(state)
  return bestFilterFields[1] && bestFilterFields[1].fieldname
}

const getMediaFieldName = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => {
    let mediaField
    for (let fieldname in fieldAnalysis) {
      const field = fieldAnalysis[fieldname]
      if (field.type !== FIELD_TYPES.IMAGE && field.type !== FIELD_TYPES.VIDEO) continue
      if (!mediaField) {
        mediaField = field
        continue
      }
      const imageVsVideo = field.type === FIELD_TYPES.IMAGE &&
                           mediaField.type === FIELD_TYPES.VIDEO
      const higherCount = field.type === mediaField.type &&
                          field.count > mediaField.count
      if (imageVsVideo || higherCount) {
        mediaField = field
      }
    }
    return mediaField && mediaField.fieldname
  }
)

const getFieldMapping = createSelector(
  (state) => state.fieldMapping,
  getTitleFieldName,
  getSubtitleFieldName,
  getMediaFieldName,
  getColoredFieldName,
  (fieldMapping, titleFieldName, subtitleFieldName, mediaFieldName, coloredFieldName) => {
    return {
      title: fieldMapping.title || titleFieldName,
      subtitle: fieldMapping.subtitle || subtitleFieldName,
      media: fieldMapping.media || mediaFieldName,
      color: fieldMapping.color || coloredFieldName
    }
  }
)

export default getFieldMapping
