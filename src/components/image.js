const React = require('react')

const style = {
  border: '1px solid white',
  boxSizing: 'border-box',
  display: 'block',
  height: '100%',
  objectFit: 'cover',
  width: '100%',
  cursor: 'pointer'
}

class Image extends React.Component {
  render () {
    const url = 'http://resizer.digital-democracy.org/400/' + this.props.url
    return <img style={Object.assign({}, style, this.props.style)} src={url} onClick={this.props.onClick} />
  }
}

module.exports = Image
