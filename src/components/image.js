import React from 'react'
import ReactDOM from 'react-dom'
import ImageLoader from 'react-imageloader'
import CircularProgress from 'material-ui/CircularProgress'
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
    backgroundColor: 'rgb(245, 245, 245)'
  }
}

const pixelRatio = window.devicePixelRatio || 1

const createDiv = React.createElement.bind(null, 'div')

class Image extends React.Component {
  state = {}

  componentDidMount () {
    const {src, resizer} = this.props
    let mediaSrc = src

    if (resizer) {
      const el = ReactDOM.findDOMNode(this)
      const size = roundUp(Math.max(el.offsetWidth, el.offsetHeight) * pixelRatio)
      mediaSrc = resizer
        .replace('{width}', size)
        .replace('{height}', size)
        .replace('{url}', src)
    }

    this.setState({
      src: mediaSrc,
      loadStart: Date.now()
    })
  }

  render () {
    const props = omit(this.props, ['progress', 'src', 'style', 'resizer'])
    const {style, progress} = this.props

    return <ImageLoader
      imgProps={assign({}, props, {style: style})}
      src={this.state.src}
      style={assign({}, styles.wrapper, style)}
      preloader={() => progress ? <CircularProgress /> : <div />}
      wrapper={(props, element) => {
        const loadTime = Date.now() - this.state.loadStart
        // Only fade in if image takes more than 200ms to load
        if (element.type !== 'img' || loadTime < 200) {
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
