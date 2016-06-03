const React = require('react')
const Dimensions = require('react-dimensions')
const { PropTypes } = React
const {Grid} = require('react-virtualized')
const Image = require('./image')

require('../../node_modules/react-virtualized/styles.css')

class ImageGrid extends React.Component {
  static propTypes = {
    containerHeight: PropTypes.number.isRequired,
    containerWidth: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    thumbSize: PropTypes.number.isRequired,
    onImageClick: PropTypes.func
  }

  static defaultProps = {
    thumbSize: 200
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.images !== nextProps.images) {
      this.refs.grid && this.refs.grid.recomputeGridSize()
    }
  }

  handleImageClick (featureId) {
    this.props.onImageClick(featureId)
  }

  render () {
    const {
      containerHeight,
      containerWidth,
      images,
      thumbSize
    } = this.props

    const columnsCount = Math.floor(containerWidth / thumbSize)
    const columnWidth = containerWidth / columnsCount
    const rowsCount = Math.ceil(images.length / columnsCount)

    return (
      <Grid
        ref='grid'
        columnCount={columnsCount}
        columnWidth={columnWidth}
        height={containerHeight}
        cellRenderer={this._renderCell}
        rowCount={rowsCount}
        rowHeight={columnWidth}
        width={containerWidth}
      />
    )
  }

  _renderCell = ({columnIndex, rowIndex}) => {
    const {
      containerWidth,
      images,
      thumbSize
    } = this.props
    const columnsCount = Math.floor(containerWidth / thumbSize)
    const image = images[(rowIndex * columnsCount) + columnIndex]
    if (!image) return
    const url = image.url
    return <Image url={url} key={url} onClick={this.handleImageClick.bind(this, image.featureId)} />
  }
}

module.exports = Dimensions({containerStyle: {flex: 3}})(ImageGrid)
