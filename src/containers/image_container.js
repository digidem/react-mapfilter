import { connect } from 'react-redux'

import ImageGrid from '../components/image_grid'
import { showFeatureDetail } from '../action_creators'
import getImages from '../selectors/images'

function mapStateToProps (state, ownProps) {
  return {
    images: getImages(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onImageClick: id => dispatch(showFeatureDetail(id))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageGrid)
