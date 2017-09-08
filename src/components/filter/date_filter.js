import PropTypes from 'prop-types'
import React from 'react'
import {findDOMNode} from 'react-dom'
import makePure from 'recompose/pure'
import DateIcon from 'material-ui-icons/DateRange'
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui-icons/Edit'
import Menu from 'material-ui/Menu'
import {DateRange} from 'react-date-range'
import moment from 'moment'
import omit from 'lodash/omit'
import {injectIntl} from 'react-intl'

import FilterSection from './filter_section'
import { listStyles } from '../../styles'
import { dateFormatShort } from '../../../config.json'
import {createMessage as msg} from '../../util/intl_helpers'

const PureDateRange = makePure(DateRange)

const styleSheet = {
  nestedList: {
    paddingTop: 0,
    paddingBottom: 0
  },
  dateItem: {
    marginLeft: 0,
    padding: '16px 56px 16px 16px',
    position: 'relative',
    fontSize: 14,
    lineHeight: '14px',
    color: 'rgba(0, 0, 0, 0.870588)'
  },
  iconButton: {
    padding: 12,
    width: 46,
    height: 46,
    top: 0,
    right: 4,
    background: 'none',
    position: 'absolute'
  },
  editIcon: {
    width: 20,
    height: 20
  },
  showAll: {
    top: 6,
    fontSize: 12
  }
}

// Material-ui passes a `nestedLevel` prop to nested items.
// We're not using a `div` instead of the material-ui component for
// nested items, so we need to remove the `nestedLevel` prop.
const NestedItem = props => {
  const divProps = omit(props, ['nestedLevel', 'children'])
  return <div {...divProps}>{props.children}</div>
}

class DateFilter extends React.PureComponent {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  }

  state = {}

  showDatePopover = (event) => {
    // This prevents ghost click.
    const target = this.refs.dateRange
    event.preventDefault()
    var range = document.createRange()
    var sel = window.getSelection()
    range.selectNodeContents(target)
    sel.removeAllRanges()
    sel.addRange(range)
    this.setState({
      open: true,
      anchorEl: target
    })
  }

  handleNestedListToggle = (e) => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  showAllDates = (e) => {
    e.preventDefault()
    this.handleDateChange({
      startDate: null,
      endDate: null
    })
  }

  handleDateChange = (e) => {
    if (e.startDate !== this.props.startDate) {
      this.props.onUpdate({
        exp: '>=',
        key: this.props.fieldName,
        val: +e.startDate
      })
    }
    if (e.endDate !== this.props.endDate) {
      this.props.onUpdate({
        exp: '<=',
        key: this.props.fieldName,
        val: +e.endDate
      })
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  componentDidMount () {
    this.setState({
      el: findDOMNode(this.refs.dateItem)
    })
  }

  render () {
    const {fieldName, min, max, classes, valueMin, valueMax, intl: {formatMessage}} = this.props
    const isFiltered = min > valueMin || max < valueMax
    const minMoment = moment(min)
    const maxMoment = moment(max)
    const rangeStr = minMoment.format(dateFormatShort) +
      ' — ' + maxMoment.format(dateFormatShort)
    const title = fieldName.split('.').slice(-1)[0]
    const subtitle = fieldName.indexOf('.') > 1 ? fieldName.split('.').slice(0, -1).join(' / ') : null

    return (
      <FilterSection
        title={formatMessage(msg('field_key')(title))}
        subtitle={subtitle && formatMessage(msg('field_key')(subtitle))}
        icon={<DateIcon />}
        isFiltered={isFiltered}
        showAll={this.showAllDates}>
        <div ref='dateRange' onClick={this.showDatePopover}>{rangeStr}</div>
        <IconButton
          onClick={this.showDatePopover}
          className={classes.iconButton}>
          <EditIcon color='#757575' className={classes.editIcon} />
        </IconButton>
        <Menu
          open={this.state.open}
          anchorEl={this.state.el}
          onRequestClose={this.handleRequestClose}
        >
          <PureDateRange
            startDate={minMoment}
            endDate={maxMoment}
            onChange={this.handleDateChange} />
        </Menu>
      </FilterSection>
    )
  }
}

export default withStyles(styleSheet)(injectIntl(DateFilter))
