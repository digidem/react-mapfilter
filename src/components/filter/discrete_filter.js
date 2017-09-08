import PropTypes from 'prop-types'
import React from 'react'
import Checkbox from 'material-ui/Checkbox'
import CheckBoxIcon from 'material-ui-icons/CheckBox'
import CheckBoxOutlineBlankIcon from 'material-ui-icons/CheckBoxOutlineBlank'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import ListIcon from 'material-ui-icons/List'
import { withStyles } from 'material-ui/styles'
import {injectIntl} from 'react-intl'
import omit from 'lodash/omit'

import FilterSection from './filter_section'
import OnlyButton from './only_button'
import {createMessage as msg} from '../../util/intl_helpers'
import { listStyles } from '../../styles'
// import {FIELD_TYPE_BOOLEAN, FIELD_TYPE_NUMBER} from '../../constants'

const styleSheet = {
  checkboxLabel: {
    lineHeight: '22px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '2px 16px'
  },
  checkboxLabelLast: {
    paddingBottom: 8
  },
  coloredSpan: {
    marginLeft: -5,
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

// Material-ui passes a `nestedLevel` prop to nested items.
// We're not using a `div` instead of the material-ui component for
// nested items, so we need to remove the `nestedLevel` prop.
const NestedItem = props => {
  const divProps = omit(props, ['nestedLevel', 'children'])
  return <div {...divProps}>{props.children}</div>
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
        <FormGroup>
          {values.map((v, i) => (
            <FormControlLabel
              key={v.value}
              classes={{root: classes.checkboxLabel}}
              style={i === values.length - 1 ? {paddingBottom: 8} : null}
              control={
                <Checkbox
                  classes={{root: classes.checkboxButton}}
                  checked={checked.indexOf(v.value) > -1}
                  icon={<CheckBoxOutlineBlankIcon classes={{root: classes.checkboxIcon}} />}
                  checkedIcon={<CheckBoxIcon classes={{root: classes.checkboxIcon}} />}
                  onChange={this.handleCheck.bind(this, v.value)}
                />
              }
              label={
                <span className={colored ? classes.coloredSpan : ''} style={colored && {backgroundColor: colorIndex[v.value]}}>
                  {formatMessage(msg('field_value')(v.value + ''))}
                </span>
              }
            />
          ))}
        </FormGroup>
      </FilterSection>
    )
      //     <NestedItem
      //       key={v.value}
      //       style={{position: 'relative'}}
      //       onMouseEnter={this.handleMouseEnter.bind(this, v.value)}
      //       onMouseLeave={this.handleMouseLeave}>
      //       <PureCheckbox
      //         label={
      //           <span style={colored ? assign({}, styles.coloredSpan, {backgroundColor: colorIndex[v.value]}) : null}>
      //             {formatMessage(msg('field_value')(v.value + ''))}
      //           </span>
      //         }
      //         title={formatMessage(msg('field_value')(v.value + ''))}
      //         value={v.value}
      //         style={styles.checkbox}
      //         iconStyle={styles.checkboxIcon}
      //         labelStyle={styles.checkboxLabel}
      //         checked={checked.indexOf(v.value) > -1}
      //         onCheck={this.handleCheck.bind(this, v.value)}
      //         disableFocusRipple
      //         disableTouchRipple />
      //       {this.state.hovered === v.value &&
      //         <OnlyButton
      //           onClick={this.handleOnlyClick.bind(this, v.value)} />}
      //     </NestedItem>
      //   ))}
      // />
  }
}

export default withStyles(styleSheet)(injectIntl(DiscreteFilter))
