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

const { t, titleCase } = require('../util/text_helpers')
const { listStyles } = require('../styles')

const styles = {
  nestedList: {
    paddingTop: 0,
    paddingBottom: 0
  },
  dateItem: {
    marginLeft: 0,
    padding: '16px 56px 16px 16px',
    position: 'relative',
    fontSize: 16,
    lineHeight: '16px',
    color: 'rgba(0, 0, 0, 0.870588)'
  },
  flatButton: {
    fontSize: 12,
    top: 5
  },
  iconButton: {
    padding: 12,
    width: 48,
    height: 48,
    top: 0,
    right: 4,
    background: 'none',
    position: 'absolute'
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

const DATE_FORMAT = 'MMM D, YYYY'

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

  showAllDates = (event) => {
    event.preventDefault()
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
    const minMoment = moment(min)
    const maxMoment = moment(max)
    const rangeStr = minMoment.format(DATE_FORMAT) + ' — ' + maxMoment.format(DATE_FORMAT)
    return (
      <ListItem
        innerDivStyle={listStyles.listItemInner}
        primaryText={titleCase(fieldName)}
        leftIcon={<DateIcon style={listStyles.listIcon} />}
        initiallyOpen
        disabled
        nestedItems={
          [<div style={styles.dateItem} ref='dateItem'>
            <div onClick={this.showDatePopover}>{rangeStr}</div>
            <IconButton onClick={this.showDatePopover} tooltip='Select dates' style={styles.iconButton}>
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
