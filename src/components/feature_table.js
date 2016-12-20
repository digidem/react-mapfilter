const React = require('react')
const ReactDOM = require('react-dom')
const {Table, TableBody, TableRow, TableRowColumn} = require('material-ui/Table')
const {FormattedMessage} = require('react-intl')
const assign = require('object-assign')
const msg = require('../util/intl_helpers').createMessage

const styles = {
  firstColumn: {
    fontWeight: 'bold'
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
    const {data} = this.props
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false} preScanRows={false}>
          {data.map((row, i) => {
            return (
              <TableRow key={row.key}>
                <TableRowColumn ref={'__td' + i} style={assign({}, styles.firstColumn, {width: this.state.width})}>
                  <span ref={row.key}><FormattedMessage {...msg('field_key')(row.key)} /></span>
                </TableRowColumn>
                <TableRowColumn>
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

module.exports = FeatureTable
