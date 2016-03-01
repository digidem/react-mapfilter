const React = require('react')
const { PropTypes } = React
const shouldPureComponentUpdate = require('react-pure-render/function')

class ContinuousFilter extends React.Component {
  static PropTypes = {
    fieldName: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  handleCheck = (e) => {
    console.log(e)
  }

  render () {
    const {fieldName} = this.props
    return (
      <div>
        <h3>{fieldName}</h3>
      </div>
    )
  }
}

module.exports = ContinuousFilter
