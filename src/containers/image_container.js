const { connect } = require('react-redux')
const history = require('../history')

const ImageGrid = require('../components/image_grid')
const getImages = require('../selectors/images')

function mapStateToProps (state, ownProps) {
  return {
    images: getImages(state)
  }
}

function mergeProps (stateProps, dispatchProps, ownProps) {
  return Object.assign({},
    {
      onImageClick: function (featureId) {
        const {location} = ownProps
        history.push({
          ...location,
          pathname: '/photos/features/' + featureId
        })
      }
    },
    stateProps, dispatchProps)
}

module.exports = connect(
  mapStateToProps,
  () => {},
  mergeProps
)(ImageGrid)
