const React = require('react')
const { PropTypes } = React
const shouldPureComponentUpdate = require('react-pure-render/function')
const makePure = require('recompose/pure').default
const DateIcon = require('material-ui/svg-icons/action/date-range').default
const {ListItem} = require('material-ui/List')
const IconButton = require('material-ui/IconButton').default
const EditIcon = require('material-ui/svg-icons/editor/mode-edit').default
const {Popover, PopoverAnimationVertical} = require('material-ui/Popover')
const DateRange = makePure(require('react-date-range').DateRange)
const moment = require('moment')

const ShowAllButton = require('./show_all_button')
const { t, titleCase } = require('../util/text_helpers')
const { listStyles } = require('../styles')
const { dateFormatShort } = require('../../config.json')

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

class DateFilter extends React.Component {
  static PropTypes = {
    fieldName: PropTypes.string.isRequired,
    onUpdate: PropTypes.func
  }

  state = {}

  shouldComponentUpdate = shouldPureComponentUpdate

  showDatePopover = (event) => {
    // This prevents ghost click.
    const target = this.refs.dateItem
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

  render () {
    const {fieldName, min, max, valueMin, valueMax} = this.props
    const isFiltered = min > valueMin || max < valueMax
    const minMoment = moment(min)
    const maxMoment = moment(max)
    const rangeStr = minMoment.format(dateFormatShort) +
      ' — ' + maxMoment.format(dateFormatShort)
    return (
      <ListItem
        innerDivStyle={listStyles.listItemInner}
        primaryText={titleCase(fieldName)}
        leftIcon={<DateIcon style={listStyles.listIcon} />}
        initiallyOpen
        rightIconButton={isFiltered ? <ShowAllButton onClick={this.showAllDates} /> : null}
        disabled
        nestedItems={
          [<div style={styles.dateItem} ref='dateItem' key='dateItem'>
            <div onClick={this.showDatePopover}>{rangeStr}</div>
            <IconButton
              onClick={this.showDatePopover}
              tooltip='Select dates'
              style={styles.iconButton}
              iconStyle={styles.editIcon}
              tooltipPosition='bottom-left'>
              <EditIcon color='#757575' />
            </IconButton>
            <Popover
              open={this.state.open}
              anchorEl={this.refs.dateItem}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <DateRange
                startDate={minMoment}
                endDate={maxMoment}
                onChange={this.handleDateChange} />
            </Popover>
          </div>]
        }
      />
    )
  }
}

module.exports = DateFilter
