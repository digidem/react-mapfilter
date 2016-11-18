const React = require('react')
const { PropTypes } = React
const {Grid, AutoSizer} = require('react-virtualized')
const getScrollBarWidth = require('get-scrollbar-width')
const { Motion, spring, presets } = require('react-motion')

require('../../node_modules/react-virtualized/styles.css')

const pixelRatio = window.devicePixelRatio || 1

const styles = {
  image: {
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

  _renderCell = (width, {columnIndex, rowIndex, key, style, isScrolling, isVisible}) => {
    const {
      images,
      thumbSize
    } = this.props
    const columnsCount = Math.floor(width / thumbSize)
    const image = images[(rowIndex * columnsCount) + columnIndex]
    if (!image) return
    style = {
      ...styles.image,
      left: style.left += 1,
      top: style.top += 1,
      width: style.width -= 2,
      height: style.height -= 2,
      position: style.position
    }
    const props = {
      src: 'http://resizer.digital-democracy.org/' + thumbSize * pixelRatio + '/' + image.url,
      key: key,
      style: style,
      onClick: this.handleImageClick.bind(this, image.featureId)
    }
    return (!isScrolling && isVisible)
      ? <ImageGridCell {...props} />
      : <img {...props} />
  }
}

class ImageGridCell extends React.Component {
  state = {hover: false, pressed: false}

  onMouseEnter = e => this.setState({hover: true})

  onMouseLeave = e => this.setState({hover: false, pressed: false})

  onMouseDown = e => this.setState({pressed: true})

  onMouseUp = e => this.setState({pressed: false})

  render () {
    const scale = this.state.pressed ? 1.05 : this.state.hover ? 1.1 : 1
    const shadow = this.state.pressed ? 5 : this.state.hover ? 10 : 0
    return (
      <Motion style={{sc: spring(scale, presets.wobbly), sh: spring(shadow, presets.wobbly)}}>
        {({sc, sh}) => {
          return <img
            {...this.props}
            style={{
              ...this.props.style,
              transform: `scale(${sc})`,
              zIndex: this.state.hover ? 1 : 0,
              boxShadow: `0 ${sh}px ${sh * 2}px rgba(0,0,0,0.19), 0 ${sh * 0.6}px ${sh * 0.6}px rgba(0,0,0,0.23)`
            }}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
          />
        }}
      </Motion>
    )
  }
}

module.exports = ImageGrid
