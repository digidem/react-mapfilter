import React from 'react'
import ReactDOM from 'react-dom'
import ImageLoader from './image_loader'
import {CircularProgress} from 'material-ui/Progress'
import BrokenImageIcon from 'material-ui-icons/BrokenImage'
import omit from 'lodash/omit'
import assign from 'object-assign'
import {connect} from 'react-redux'

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    position: 'absolute',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}

const pixelRatio = window.devicePixelRatio || 1

const createDiv = React.createElement.bind(null, 'div')

class Image extends React.Component {
  state = {}

  componentDidMount () {
    this.onPropChange({}, this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.onPropChange(this.props, nextProps)
  }

  onPropChange (props, nextProps) {
    if (props.src === nextProps.src) return
    const {src, resizer} = nextProps
    let mediaSrc = src

    if (resizer) {
      const el = ReactDOM.findDOMNode(this)
      const size = roundUp(Math.max(el.offsetWidth, el.offsetHeight) * pixelRatio)
      mediaSrc = resizer(src, size)
    }

    this.setState({
      src: mediaSrc
    })
  }

  render () {
    // TODO: whitelist, not blacklist
    const props = omit(this.props, ['progress', 'src', 'style', 'resizer', 'dispatch'])
    const {style, resizer, src} = this.props
    const previewUrl = resizer(src, 200 * pixelRatio)
    return <ImageLoader
      imgProps={assign({}, props, {style: style})}
      src={this.state.src}
      style={assign({}, styles.wrapper, style, {backgroundImage: 'url(' + previewUrl + ')'})}
      preloader={() => <div style={styles.wrapper}><CircularProgress /></div>}
      wrapper={(props, element) => {
        if (!element) {
          return <div style={styles.wrapper}><BrokenImageIcon color='grey' /></div>
        } else {
          return createDiv(props, element)
        }
      }}
    />
  }
}

export default connect(
  state => ({resizer: state.resizer})
)(Image)

function roundUp (v) {
  return Math.ceil(v / 50) * 50
}
