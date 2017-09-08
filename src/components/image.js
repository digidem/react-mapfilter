import React from 'react'
import ReactDOM from 'react-dom'
import ImageLoader from 'react-imageloader'
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
    justifyContent: 'center'
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
      src: mediaSrc,
      loadStart: Date.now()
    })
  }

  render () {
    // TODO: whitelist, not blacklist
    const props = omit(this.props, ['progress', 'src', 'style', 'resizer', 'dispatch'])
    const {style} = this.props

    return <ImageLoader
      imgProps={assign({}, props, {style: style})}
      src={this.state.src}
      style={assign({}, styles.wrapper, style)}
      preloader={() => <div style={styles.wrapper}><CircularProgress /></div>}
      wrapper={(props, element) => {
        const loadTime = Date.now() - this.state.loadStart
        if (!element) {
          return <div style={styles.wrapper}><BrokenImageIcon color='grey' /></div>
        } else if (element.type !== 'img' || loadTime < 200) {
          // Only fade in if image takes more than 200ms to load
          return createDiv(props, element)
        } else {
          const mergedProps = assign({}, props, {
            className: 'fadeIn'
          })
          return createDiv(mergedProps, element)
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
