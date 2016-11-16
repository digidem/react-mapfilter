const React = require('react')
const ReactDOM = require('react-dom')
const ImageLoader = require('react-imageloader')
const CircularProgress = require('material-ui/CircularProgress').default
const {Motion, spring} = require('react-motion')
const omit = require('lodash/omit')

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

class Image extends React.Component {
  state = {}

  componentDidMount () {
    const el = ReactDOM.findDOMNode(this)
    const size = Math.max(el.offsetWidth, el.offsetHeight) * pixelRatio
    this.setState({
      src: 'http://resizer.digital-democracy.org/' + roundUp(size) + '/' + this.props.src
    })
  }

  render () {
    const props = omit(this.props, ['src', 'style'])
    const {style} = this.props

    return <ImageLoader
      imgProps={{...props, style: style}}
      src={this.state.src}
      style={{...styles.wrapper, ...style}}
      preloader={() => <CircularProgress />}
      wrapper={(props, element) => {
        if (element.type !== 'img') {
          return React.createElement.call(null, 'div', props, element)
        } else {
          return (
            <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(1)}}>
              {style => {
                const mergedProps = {
                  ...props,
                  style: {
                    ...props.style,
                    ...style
                  }
                }
                return React.createElement.call(null, 'div', mergedProps, element)
              }}
            </Motion>
          )
        }
      }}
    />
  }
}

module.exports = Image

function roundUp (v) {
  return Math.ceil(v / 50) * 50
}
