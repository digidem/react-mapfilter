const { connect } = require('react-redux')
const history = require('../history')

const ImageGrid = require('../components/image_grid')
const getImages = require('../selectors/images')

function mapStateToProps (state, ownProps) {
  return {
    images: getImages(state),
    onImageClick: function (featureId) {
      const {location} = ownProps
      history.push({
        ...location,
        pathname: '/photos/features/' + featureId
      })
    }
  }
}

module.exports = connect(
  mapStateToProps
)(ImageGrid)
