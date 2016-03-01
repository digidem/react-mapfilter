const React = require('react')
const { PropTypes } = React
const shouldPureComponentUpdate = require('react-pure-render/function')
const Checkbox = require('material-ui/lib/checkbox')

const { t } = require('../util/text_helpers')

const styles = {
  checkbox: {
    marginBottom: 8,
    fontSize: 14
  },
  labelStyle: {
    lineHeight: '22px'
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 8
  }
}

class DiscreteFilter extends React.Component {
  static PropTypes = {
    fieldName: PropTypes.string.isRequired,
    checked: PropTypes.array,
    values: PropTypes.array,
    onUpdate: PropTypes.func
  }

  static defaultProps = {
    checked: [],
    onUpdate: (x) => x
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  handleCheck = (e) => {
    const v = e.target.value
    const checked = this.props.checked.slice(0)
    if (e.target.checked && checked.indexOf(v) === -1) {
      checked.push(v)
    } else if (!e.target.checked && checked.indexOf(v) > -1) {
      checked.splice(checked.indexOf(v), 1)
    }
    this.props.onUpdate(['in', this.props.fieldName, ...checked])
  }

  render () {
    const {fieldName, checked, values} = this.props
    return (
      <div>
        <h3>{fieldName}</h3>
        {Object.keys(values).map((v) => <Checkbox
          key={v}
          label={t(v)}
          value={v}
          style={styles.checkbox}
          iconStyle={styles.iconStyle}
          labelStyle={styles.labelStyle}
          checked={checked.indexOf(v) > -1}
          onCheck={this.handleCheck}
          disableFocusRipple
          disableTouchRipple
        />)}
      </div>
    )
  }
}

module.exports = DiscreteFilter
