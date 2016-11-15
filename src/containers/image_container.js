const { connect } = require('react-redux')

const ImageGrid = require('../components/image_grid')
const getImages = require('../selectors/images')

function mapStateToProps (state, ownProps) {
  return {
    images: getImages(state)
  }
}

module.exports = connect(
  mapStateToProps
)(ImageGrid)
