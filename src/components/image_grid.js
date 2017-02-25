import React, { PropTypes } from 'react'
import {Grid, AutoSizer} from 'react-virtualized'
import getScrollBarWidth from 'get-scrollbar-width'
import assign from 'object-assign'

require('react-virtualized/styles.css')

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
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
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
      style={assign({}, styles.image, style)}
      onClick={this.handleImageClick.bind(this, image.featureId)}
    />
  }
}

export default ImageGrid
