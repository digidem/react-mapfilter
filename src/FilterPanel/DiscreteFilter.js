// @flow
import * as React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ListIcon from '@material-ui/icons/List'
import { makeStyles } from '@material-ui/core/styles'
// import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import CommentIcon from '@material-ui/icons/Comment'
import FilterSection from './FilterSection'
import OnlyButton from './OnlyButton'
import type { Key, Filter } from '../types'

// import {FIELD_TYPE_BOOLEAN, FIELD_TYPE_NUMBER} from '../../constants'

const FilterItem = ({ onClick, checked, label, id }) => {
  const cx = useStyles()
  return (
    <ListItem
      role={undefined}
      dense
      button
      onClick={onClick}
      className={cx.filterItem}>
      <ListItemIcon className={cx.checkboxIcon}>
        <Checkbox
          edge="start"
          checked={checked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': id }}
          className={cx.checkbox}
        />
      </ListItemIcon>
      <ListItemText id={id} primary={label} />
      <ListItemSecondaryAction>
        <OnlyButton className={cx.onlyButton} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

type Props = {
  label: React.Node,
  fieldKey: Key,
  filter?: Filter | null,
  values: Array<{ value: any, label: React.Node }>,
  onChangeFilter: (filter: Array<any> | null) => void
}

const DiscreteFilter = ({
  label,
  fieldKey,
  filter,
  values,
  onChangeFilter
}: Props) => {
  return (
    <FilterSection
      title={label}
      icon={<ListIcon />}
      isFiltered={true}
      onShowAllClick={() => onChangeFilter(null)}>
      {values.map((v, i) => (
        <FilterItem key={i} label={v.label} checked />
      ))}
    </FilterSection>
  )
}

class DiscreteFilterOld extends React.PureComponent {
  static defaultProps = {
    checked: [],
    onUpdate: x => x
  }

  state = {}

  showAll = e => {
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

  handleOnlyClick(key, e) {
    e.preventDefault()
    this.props.onUpdate({
      exp: 'in',
      key: this.props.fieldName,
      val: [key]
    })
  }

  handleMouseEnter(key) {
    this.setState({ hovered: key })
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false })
  }

  render() {
    const {
      fieldName,
      checked,
      values,
      classes,
      colored,
      colorIndex,
      intl: { formatMessage }
    } = this.props
    const isFiltered = checked.length < values.length
    const title = fieldName.split('.').slice(-1)[0]
    const subtitle =
      fieldName.indexOf('.') > 1
        ? fieldName
            .split('.')
            .slice(0, -1)
            .join(' / ')
        : null

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
                classes={{
                  root: classes.formControlRoot,
                  label: classes.formControlLabel
                }}
                control={
                  <Checkbox
                    classes={{ root: classes.checkboxButton }}
                    checked={checked.indexOf(v.value) > -1}
                    icon={
                      <CheckBoxOutlineBlankIcon
                        classes={{ root: classes.checkboxIcon }}
                      />
                    }
                    checkedIcon={
                      <CheckBoxIcon classes={{ root: classes.checkboxIcon }} />
                    }
                    onChange={e => this.handleCheck(v.value, e)}
                  />
                }
                label={
                  <span
                    className={colored ? classes.coloredSpan : ''}
                    style={
                      colored ? { backgroundColor: colorIndex[v.value] } : null
                    }
                    title={formatMessage(msg('field_value')(v.value))}>
                    {formatMessage(msg('field_value')(v.value))}
                  </span>
                }
              />
              {this.state.hovered === v.value && (
                <OnlyButton onClick={e => this.handleOnlyClick(v.value, e)} />
              )}
            </div>
          ))}
        </FormGroup>
      </FilterSection>
    )
  }
}

export default DiscreteFilter

const useStyles = makeStyles(theme => ({
  filterItem: {
    '& $onlyButton': {
      display: 'none'
    },
    '&:hover $onlyButton': {
      display: 'block'
    }
  },
  onlyButton: {
    fontSize: 12,
    lineHeight: '16px',
    minWidth: 'auto'
  },
  checkboxIcon: {
    minWidth: 40
  },
  checkbox: {
    padding: 0,
    paddingLeft: 12,
    '&:hover': {
      backgroundColor: 'inherit !important'
    }
  }
}))
