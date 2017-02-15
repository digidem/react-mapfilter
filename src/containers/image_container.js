const { connect } = require('react-redux')

const ImageGrid = require('../components/image_grid')
const { showFeatureDetail } = require('../action_creators')
const getImages = require('../selectors/images')

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

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageGrid)
