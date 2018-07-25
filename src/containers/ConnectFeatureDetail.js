import { connect } from 'react-redux'

import FeatureDetail from '../components/FeatureDetail'
import getFeaturesById from '../selectors/features_by_id'
import getFieldAnalysis from '../selectors/field_analysis'
import {editFeature, deleteFeature} from '../action_creators'
import {FIELD_TYPE_IMAGE} from '../constants'

export default connect(
  (state, ownProps) => {
    const featuresById = getFeaturesById(state)
    const fieldAnalysis = getFieldAnalysis(state)
    const id = ownProps.id || state.ui.featureId
    const feature = featuresById[id]
    return {
      media: getMedia(feature, fieldAnalysis),
      coordFormat: state.settings.coordFormat,
      feature: feature,
      detailViewButtons: ownProps.detailViewButtons,
      fieldAnalysis: fieldAnalysis,
      fieldOrder: state.fieldOrder
    }
  },
  (dispatch) => ({
    onEditFeature: (feature) => dispatch(editFeature(feature)),
    onDeleteFeature: (id) => dispatch(deleteFeature(id))
  })
)(FeatureDetail)

// Gets all the media fields for a feature
function getMedia (feature, fieldAnalysis) {
  const media = []
  if (!feature) return media
  Object.keys(fieldAnalysis.properties)
    .forEach(fieldname => {
      if (fieldAnalysis.properties[fieldname].type !== FIELD_TYPE_IMAGE) return
      if (!feature.properties[fieldname]) return
      media.push({
        fieldname: fieldname,
        value: feature.properties[fieldname]
      })
    })
  return media
}
