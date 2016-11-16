const React = require('react')
const { PropTypes } = React
const {Grid, AutoSizer} = require('react-virtualized')
const getScrollBarWidth = require('get-scrollbar-width')

require('../../node_modules/react-virtualized/styles.css')

const pixelRatio = window.devicePixelRatio || 1

const styles = {
  image: {
    border: '1px solid white',
    boxSizing: 'border-box',
    display: 'block',
    height: '100%',
    objectFit: 'cover',
    width: '100%',
    cursor: 'pointer',
    backgroundColor: 'rgb(240, 240, 240)'
  }
}

class ImageGrid extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    thumbSize: PropTypes.number.isRequired,
    onImageClick: PropTypes.func
  }

  static defaultProps = {
    thumbSize: 200
  }

  componentWillMount () {
    this.scrollbarWidth = getScrollBarWidth()
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
      images,
      thumbSize
    } = this.props

    return (
      <div style={{flex: 3}}>
        <AutoSizer>
          {({height, width}) => {
            const columnsCount = Math.floor(width / thumbSize)
            const rowsCount = Math.ceil(images.length / columnsCount)
            let cellSize = width / columnsCount
            const overflow = cellSize * rowsCount > height
            if (overflow && this.scrollbarWidth) {
              cellSize = (width - this.scrollbarWidth) / columnsCount
            }
            return <Grid
              ref='grid'
              columnCount={columnsCount}
              columnWidth={cellSize}
              height={height}
              cellRenderer={this._renderCell.bind(this, width)}
              rowCount={rowsCount}
              rowHeight={cellSize}
              width={width}
            />
          }}
        </AutoSizer>
      </div>
    )
  }

  _renderCell = (width, {columnIndex, rowIndex, key, style}) => {
    const {
      images,
      thumbSize
    } = this.props
    const columnsCount = Math.floor(width / thumbSize)
    const image = images[(rowIndex * columnsCount) + columnIndex]
    if (!image) return
    const url = 'http://resizer.digital-democracy.org/' + thumbSize * pixelRatio + '/' + image.url
    return <img
      src={url}
      key={key}
      style={{...styles.image, ...style}}
      onClick={this.handleImageClick.bind(this, image.featureId)}
    />
  }
}

module.exports = ImageGrid
