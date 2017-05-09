import { createSelector } from 'reselect'

import getBestFilterFields from './best_fields'
import getFieldAnalysis from './field_analysis'
import getFilterFields from './filter_fields'
import getDateFieldName from './date_field'
import {
  FIELD_TYPE_IMAGE,
  FIELD_TYPE_VIDEO,
  FILTER_TYPE_DISCRETE
} from '../constants'

const getTitleFieldName = createSelector(
  getBestFilterFields,
  getDateFieldName,
  (bestFilterFields, dateFieldName) => {
    return (bestFilterFields[0] && bestFilterFields[0].fieldname) ||
      dateFieldName || 'No Title'
  }
)

const getSubtitleFieldName = createSelector(
  getBestFilterFields,
  (bestFilterFields) => bestFilterFields[1] && bestFilterFields[1].fieldname
)

const getMediaFieldName = createSelector(
  getFieldAnalysis,
  (fieldAnalysis) => {
    let mediaField
    for (let fieldname in fieldAnalysis.properties) {
      const field = fieldAnalysis.properties[fieldname]
      if (field.type !== FIELD_TYPE_IMAGE && field.type !== FIELD_TYPE_VIDEO) continue
      if (!mediaField) {
        mediaField = field
        continue
      }
      const imageVsVideo = field.type === FIELD_TYPE_IMAGE &&
                           mediaField.type === FIELD_TYPE_VIDEO
      const higherCount = field.type === mediaField.type &&
                          field.count > mediaField.count
      if (imageVsVideo || higherCount) {
        mediaField = field
      }
    }
    return mediaField && mediaField.fieldname
  }
)

const getColoredFieldName = createSelector(
  (state) => state.fieldMapping,
  getFieldAnalysis,
  getFilterFields,
  (fieldMapping, fieldAnalysis, visibleFilters) => {
    if (fieldMapping.color) return fieldMapping.color
    var discreteFilters = visibleFilters.filter(function (fieldName) {
      return fieldAnalysis.properties[fieldName].filterType === FILTER_TYPE_DISCRETE
    })
    return discreteFilters[0]
  }
)

const getFieldMapping = createSelector(
  (state) => state.fieldMapping,
  getTitleFieldName,
  getSubtitleFieldName,
  getMediaFieldName,
  getColoredFieldName,
  getDateFieldName,
  (fieldMapping, titleFieldName, subtitleFieldName, mediaFieldName, coloredFieldName, dateFieldName) => {
    return {
      title: fieldMapping.title || titleFieldName,
      subtitle: fieldMapping.subtitle || subtitleFieldName,
      media: fieldMapping.media || mediaFieldName,
      color: coloredFieldName,
      date: dateFieldName
    }
  }
)

export default getFieldMapping
