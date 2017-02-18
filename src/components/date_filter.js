import React, { PropTypes } from 'react'
import {findDOMNode} from 'react-dom'
import shouldPureComponentUpdate from 'react-pure-render/function'
import makePure from 'recompose/pure'
import DateIcon from 'material-ui/svg-icons/action/date-range'
import {ListItem} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover'
import {DateRange} from 'react-date-range'
import moment from 'moment'
import omit from 'lodash/omit'
import {injectIntl} from 'react-intl'

import ShowAllButton from './show_all_button'
import { listStyles } from '../styles'
import { dateFormatShort } from '../../config.json'
import {createMessage as msg} from '../util/intl_helpers'

const PureDateRange = makePure(DateRange)

const styles = {
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
    fontSize: 12,
    lineHeight: '16px',
    height: 16,
    margin: '4px 0px 0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}

// Material-ui passes a `nestedLevel` prop to nested items.
// We're not using a `div` instead of the material-ui component for
// nested items, so we need to remove the `nestedLevel` prop.
const NestedItem = props => {
  const divProps = omit(props, ['nestedLevel', 'children'])
  return <div {...divProps}>{props.children}</div>
}

class DateFilter extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  }

  state = {}

  shouldComponentUpdate = shouldPureComponentUpdate

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
      startDate: this.props.valueMin,
      endDate: this.props.valueMax
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
    const {fieldName, min, max, valueMin, valueMax, intl: {formatMessage}} = this.props
    const isFiltered = min > valueMin || max < valueMax
    const minMoment = moment(min)
    const maxMoment = moment(max)
    const rangeStr = minMoment.format(dateFormatShort) +
      ' — ' + maxMoment.format(dateFormatShort)
    const title = fieldName.split('.').slice(-1)[0]
    const subTitle = fieldName.indexOf('.') > 1 ? fieldName.split('.').slice(0, -1).join(' / ') : null

    return (
      <ListItem
        innerDivStyle={listStyles.listItemInner}
        primaryText={formatMessage(msg('field_key')(title))}
        secondaryText={subTitle && formatMessage(msg('field_key')(subTitle))}
        leftIcon={<DateIcon style={listStyles.listIcon} />}
        initiallyOpen
        rightIconButton={isFiltered ? <ShowAllButton onTouchTap={this.showAllDates} /> : null}
        disabled
        ref='dateItem'
        nestedItems={
          [<NestedItem style={styles.dateItem} key='dateItem'>
            <div ref='dateRange' onClick={this.showDatePopover}>{rangeStr}</div>
            <IconButton
              onTouchTap={this.showDatePopover}
              tooltip='Select dates'
              style={styles.iconButton}
              iconStyle={styles.editIcon}
              tooltipPosition='bottom-left'>
              <EditIcon color='#757575' />
            </IconButton>
            <Popover
              open={this.state.open}
              anchorEl={this.state.el}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <PureDateRange
                startDate={minMoment}
                endDate={maxMoment}
                onChange={this.handleDateChange} />
            </Popover>
          </NestedItem>]
        }
      />
    )
  }
}

export default injectIntl(DateFilter)
