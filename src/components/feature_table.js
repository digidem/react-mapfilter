import React from 'react'
import ReactDOM from 'react-dom'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import {FormattedMessage} from 'react-intl'
import assign from 'object-assign'
import {createMessage as msg} from '../util/intl_helpers'

const styles = {
  firstColumn: {
    fontWeight: 'bold'
  },
  smallRow: {
    height: 36
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
    const rowColStyle = assign({}, styles.firstColumn, {width: this.state.width})
    if (print) assign(rowColStyle, styles.smallRow)
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false} preScanRows={false}>
          {data.map((row, i) => {
            return (
              <TableRow key={row.key} style={print && styles.smallRow}>
                <TableRowColumn ref={'__td' + i} style={rowColStyle}>
                  <span ref={row.key}><FormattedMessage {...msg('field_key')(row.key)} /></span>
                </TableRowColumn>
                <TableRowColumn style={styles.smallRow}>
                  <FormattedMessage {...msg('field_value')(row.value)} />
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
