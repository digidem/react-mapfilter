import React from 'react'
import ReactDOM from 'react-dom'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import {FormattedMessage, FormattedDate} from 'react-intl'
import assign from 'object-assign'

import {createMessage as msg} from '../util/intl_helpers'
import FormattedFieldname from './formatted_fieldname'
import {FIELD_TYPES} from '../constants'
import {parseDate} from '../util/filter_helpers'

const styles = {
  firstColumn: {
    fontWeight: 'bold',
    height: 'auto',
    verticalAlign: 'top',
    padding: '16px 24px'
  },
  secondColumn: {
    height: 'auto',
    padding: '15px 24px 15px 0',
    lineHeight: '18px',
    whiteSpace: 'normal'
  },
  row: {
    height: 'auto'
  }
}

class FeatureTable extends React.Component {
  static defaultProps = {
    data: []
  }

  state = {
    width: '50%'
  }

  componentDidMount () {
    this.autoFitColumn()
  }

  componentDidUpdate (prevProps) {
    if (this.props.data !== prevProps.data) {
      this.autoFitColumn()
    }
  }

  autoFitColumn () {
    let width = 0
    this.props.data.forEach(row => {
      var rowEl = ReactDOM.findDOMNode(this.refs[row.key])
      width = Math.max(width, rowEl.offsetWidth)
    })
    this.setState({
      width: width
    })
  }

  render () {
    const {data, print} = this.props
    const firstColStyle = assign({}, styles.firstColumn, {width: this.state.width})
    if (print) assign(firstColStyle, styles.smallRow)
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false} preScanRows={false}>
          {data.map((row, i) => {
            return (
              <TableRow key={row.key} style={styles.row}>
                <TableRowColumn ref={'__td' + i} style={firstColStyle}>
                  <span ref={row.key}>
                    <FormattedFieldname fieldname={row.key} />
                  </span>
                </TableRowColumn>
                <TableRowColumn style={styles.secondColumn}>
                  {row.type === FIELD_TYPES.DATE
                    ? <FormattedDate
                      value={parseDate(row.value)}
                      year='numeric'
                      month='long'
                      day='2-digit' />
                    : <FormattedMessage {...msg('field_value')(row.value)} />
                  }
                </TableRowColumn>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  }
}

export default FeatureTable
