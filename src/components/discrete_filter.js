const React = require('react')
const { PropTypes } = React
const shouldPureComponentUpdate = require('react-pure-render/function')
const makePure = require('recompose/pure').default
const Checkbox = makePure(require('material-ui/Checkbox').default)
const ListIcon = require('material-ui/svg-icons/action/list').default
const {ListItem} = require('material-ui/List')

const { t, titleCase } = require('../util/text_helpers')

const styles = {
  checkbox: {
    marginBottom: 8,
    fontSize: 14
  },
  listItemInner: {
    paddingLeft: 48
  },
  listIcon: {
    left: 0
  },
  nestedList: {
    padding: '8px 14px',
    borderBottom: '1px solid rgb(224, 224, 224)'
  },
  checkboxLabel: {
    lineHeight: '22px'
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    marginRight: 14
  },
  headerStyle: {
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'bold'
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
    this.props.onUpdate({
      exp: 'in',
      key: this.props.fieldName,
      val: checked
    })
  }

  render () {
    const {fieldName, checked, values} = this.props
    return (
      <ListItem
        style={styles.listItem}
        innerDivStyle={styles.listItemInner}
        primaryText={titleCase(fieldName)}
        leftIcon={<ListIcon style={styles.listIcon} />}
        initiallyOpen
        primaryTogglesNestedList
        nestedListStyle={styles.nestedList}
        nestedItems={Object.keys(values).map((v) => <Checkbox
          key={v}
          label={t(v)}
          value={v}
          style={styles.checkbox}
          iconStyle={styles.checkboxIcon}
          labelStyle={styles.checkboxLabel}
          checked={checked.indexOf(v) > -1}
          onCheck={this.handleCheck}
          disableFocusRipple
          disableTouchRipple
        />)}
      />
    )
  }
}

module.exports = DiscreteFilter
