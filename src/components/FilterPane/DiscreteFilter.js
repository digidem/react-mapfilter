import PropTypes from 'prop-types'
import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListIcon from '@material-ui/icons/List'
import { withStyles } from '@material-ui/core/styles'
import {injectIntl} from 'react-intl'

import FilterSection from './FilterSection'
import OnlyButton from './OnlyButton'
import {createMessage as msg} from '../../util/intl_helpers'
// import {FIELD_TYPE_BOOLEAN, FIELD_TYPE_NUMBER} from '../../constants'

const styles = {
  formGroup: {
    paddingBottom: 8
  },
  formControlRoot: {
    lineHeight: '22px',
    padding: '2px 16px',
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    marginRight: 0,
    marginLeft: 0
  },
  formControlLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  coloredSpan: {
    backgroundColor: 'rgb(0, 188, 212)',
    borderRadius: 2,
    padding: '2px 5px',
    color: 'white',
    letterSpacing: '0.02em',
    fontSize: 13,
    lineHeight: '24px'
  },
  showAll: {
    top: 6,
    fontSize: 12
  },
  checkboxItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  checkboxButton: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  checkboxIcon: {
    width: 20,
    height: 20
  }
}

class DiscreteFilter extends React.PureComponent {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    checked: PropTypes.array,
    values: PropTypes.arrayOf(PropTypes.object),
    onUpdate: PropTypes.func
  }

  static defaultProps = {
    checked: [],
    onUpdate: (x) => x
  }

  state = {}

  showAll = (e) => {
    e.preventDefault()
    this.props.onUpdate({
      exp: 'in',
      key: this.props.fieldName,
      val: null
    })
  }

  handleCheck = (value, e) => {
    const checked = this.props.checked.slice(0)
    if (e.target.checked && checked.indexOf(value) === -1) {
      checked.push(value)
    } else if (!e.target.checked && checked.indexOf(value) > -1) {
      checked.splice(checked.indexOf(value), 1)
    }
    this.props.onUpdate({
      exp: 'in',
      key: this.props.fieldName,
      val: checked
    })
  }

  handleOnlyClick (key, e) {
    e.preventDefault()
    this.props.onUpdate({
      exp: 'in',
      key: this.props.fieldName,
      val: [key]
    })
  }

  handleMouseEnter (key) {
    this.setState({hovered: key})
  }

  handleMouseLeave = () => {
    this.setState({hovered: false})
  }

  render () {
    const {fieldName, checked, values, classes, colored, colorIndex, intl: {formatMessage}} = this.props
    const isFiltered = checked.length < values.length
    const title = fieldName.split('.').slice(-1)[0]
    const subtitle = fieldName.indexOf('.') > 1 ? fieldName.split('.').slice(0, -1).join(' / ') : null

    return (
      <FilterSection
        title={formatMessage(msg('field_key')(title))}
        subtitle={subtitle && formatMessage(msg('field_key')(subtitle))}
        icon={<ListIcon />}
        isFiltered={isFiltered}
        showAll={this.showAll}>
        <FormGroup className={classes.formGroup}>
          {values.map((v, i) => (
            <div
              className={classes.checkboxItem}
              key={v.value}
              onMouseEnter={() => this.handleMouseEnter(v.value)}
              onMouseLeave={this.handleMouseLeave}>
              <FormControlLabel
                classes={{root: classes.formControlRoot, label: classes.formControlLabel}}
                control={
                  <Checkbox
                    classes={{root: classes.checkboxButton}}
                    checked={checked.indexOf(v.value) > -1}
                    icon={<CheckBoxOutlineBlankIcon classes={{root: classes.checkboxIcon}} />}
                    checkedIcon={<CheckBoxIcon classes={{root: classes.checkboxIcon}} />}
                    onChange={(e) => this.handleCheck(v.value, e)}
                  />
                }
                label={
                  <span
                    className={colored ? classes.coloredSpan : ''}
                    style={colored ? {backgroundColor: colorIndex[v.value]} : null}
                    title={formatMessage(msg('field_value')(v.value))}>
                    {formatMessage(msg('field_value')(v.value))}
                  </span>
                }
              />
              {(this.state.hovered === v.value) &&
                <OnlyButton onClick={(e) => this.handleOnlyClick(v.value, e)} />
              }
            </div>
          ))}
        </FormGroup>
      </FilterSection>
    )
  }
}

export default withStyles(styles)(injectIntl(DiscreteFilter))
