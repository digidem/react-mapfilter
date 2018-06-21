import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import React from 'react'
import makePure from 'recompose/pure'
import DateIcon from '@material-ui/icons/DateRange'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import Popover from '@material-ui/core/Popover'
import {DateRange} from 'react-date-range'
import moment from 'moment'
import {injectIntl} from 'react-intl'

import FilterSection from './FilterSection'
import { dateFormatShort } from '../../../config.json'
import {createMessage as msg} from '../../util/intl_helpers'

const PureDateRange = makePure(DateRange)

const styles = theme => ({
  nestedList: {
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    textTransform: 'none',
    fontWeight: 'inherit',
    padding: '4px 5px',
    margin: '9px 0 9px 52px',
    fontSize: 13,
    minHeight: 'auto'
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
    top: 0,
    width: 38,
    right: 8,
    height: 38,
    padding: 9,
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
  },
  popover: {
    fontFamily: theme.typography.fontFamily
  }
})

class DateFilter extends React.PureComponent {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  }

  state = {
    open: false
  }

  showDatePopover = (event) => {
    event.preventDefault()
    var range = document.createRange()
    var sel = window.getSelection()
    range.selectNodeContents(this.buttonNode)
    sel.removeAllRanges()
    this.setState({
      open: true
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
        <Button
          ref={el => (this.buttonNode = ReactDOM.findDOMNode(el))}
          onClick={this.showDatePopover}
          className={classes.button}>
          {rangeStr}
        </Button>
        <IconButton
          onClick={this.showDatePopover}
          className={classes.iconButton}>
          <EditIcon nativeColor='#757575' className={classes.editIcon} />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.buttonNode}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          onClose={this.handleRequestClose}
          className={classes.popover}
        >
          <PureDateRange
            startDate={minMoment}
            endDate={maxMoment}
            onChange={this.handleDateChange} />
        </Popover>
      </FilterSection>
    )
  }
}

export default withStyles(styles)(injectIntl(DateFilter))
