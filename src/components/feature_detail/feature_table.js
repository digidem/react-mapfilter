import React from 'react'
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table'
import {FormattedMessage, FormattedDate, defineMessages} from 'react-intl'
import assign from 'object-assign'

import {createMessage as msg} from '../../util/intl_helpers'
import FormattedFieldname from '../shared/formatted_fieldname'
import FormattedCoords from '../shared/formatted_coords'
import {parseDate} from '../../util/filter_helpers'
import IconButton from 'material-ui/IconButton'
import VisibilityIcon from 'material-ui/svg-icons/action/visibility'
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import {
  FIELD_TYPE_DATE,
  FIELD_TYPE_LOCATION,
  FIELD_TYPE_STRING,
  FIELD_TYPE_ARRAY,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_UUID,
  FIELD_TYPE_MIXED,
  FIELD_TYPE_IMAGE,
  FIELD_TYPE_VIDEO,
  FIELD_TYPE_MEDIA,
  FIELD_TYPE_AUDIO
} from '../../constants'

const messages = defineMessages({
  visibility: {
    id: 'featureDetail.visibilitySwitch',
    defaultMessage: 'Hide or show field',
    description: 'Tooltip for button to hide or show a field'
  }
})

// const visibilityOff = require('material-ui/svg-icons/action/visibility-off')
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
  secondColumnEdit: {
    padding: '15px 0 15px 0'
  },
  row: {
    paddingTop: 3,
    height: 'auto'
  },
  smallRow: {
    paddingTop: 8,
    paddingBottom: 8
  },
  textField: {
    fontSize: 13,
    lineHeight: '18px',
    height: 39
  },
  editRow: {
    paddingTop: 4,
    paddingBottom: 4
  },
  fieldUnderline: {
    bottom: 4,
    borderBottom: '1px dashed #c0c0c0',
    borderColor: '#c0c0c0'
  }
}

const ValueCell = ({value, type, coordFormat}) => (
  type === FIELD_TYPE_DATE
  ? <FormattedDate
    value={parseDate(value)}
    year='numeric'
    month='long'
    day='2-digit' />
  : type === FIELD_TYPE_LOCATION
  ? <FormattedCoords value={value} format={coordFormat} />
  : <FormattedMessage {...msg('field_value')(value)} />
)

const ValueCellEdit = ({value, type, coordFormat, fieldMetadata = {}, onChange}) => {
  const values = type === FIELD_TYPE_BOOLEAN
    ? [true, false]
    : Array.isArray(fieldMetadata.values) && fieldMetadata.values.map(d => d.value)
  const isDiscreteField = type === FIELD_TYPE_STRING && fieldMetadata.values &&
    fieldMetadata.values.length / fieldMetadata.count < 0.8
  if (isDiscreteField || type === FIELD_TYPE_BOOLEAN) {
    return <SelectField
      style={styles.textField}
      underlineStyle={styles.fieldUnderline}
      iconStyle={{height: 39, padding: 7}}
      labelStyle={{height: 35, lineHeight: '39px', top: 0}}
      autoWidth
      fullWidth
      value={value}
      onChange={onChange}>
      {values.map(d => (
        <MenuItem
          key={d}
          value={d}
          style={{fontSize: 13}}
          primaryText={<FormattedMessage {...msg('field_value')(d)} />}
        />
      ))}
    </SelectField>
  }
  if (type === FIELD_TYPE_STRING || type === FIELD_TYPE_MIXED) {
    return <TextField
      fullWidth
      multiLine
      underlineStyle={styles.fieldUnderline}
      value={value}
      onChange={onChange}
      style={styles.textField} />
  }
  if (type === FIELD_TYPE_ARRAY) {
    return <SelectField
      style={styles.textField}
      underlineStyle={styles.fieldUnderline}
      iconStyle={{height: 39, padding: 7}}
      labelStyle={{height: 35, lineHeight: '39px', top: 0}}
      multiple
      autoWidth
      fullWidth
      value={value}
      selectionRenderer={value => <FormattedMessage {...msg('field_value')(value)} />}
      onChange={onChange}>
      {values.map(d => (
        <MenuItem
          key={d}
          insetChildren
          checked={value && value.includes(d)}
          value={d}
          style={{fontSize: 13}}
          primaryText={<FormattedMessage {...msg('field_value')(d)} />}
        />
      ))}
    </SelectField>
  }
  return <ValueCell value={value} type={type} coordFormat={coordFormat} />
}

class Row extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  handleChange () {
    let value
    if (arguments.length === 3) value = arguments[2]
    else value = arguments[1]
    this.props.onValueChange(this.props._key, value)
  }

  handleVisibilityChange () {
    this.props.onVisibilityChange(this.props._key, !this.props.hidden)
  }

  render () {
    const {_key, value, type, hidden, editMode, coordFormat, fieldMetadata, firstColStyle, secondColStyle} = this.props
    const rowStyle = assign({}, styles.row, {opacity: hidden ? 0.4 : 1, borderBottomColor: editMode ? '#f0f0f0' : '#e0e0e0'})
    return (
      <TableRow key={_key} style={rowStyle}>
        <TableRowColumn style={firstColStyle}>
          <span ref={'firstColumn'}>
            <FormattedFieldname fieldname={_key} />
          </span>
        </TableRowColumn>
        <TableRowColumn style={secondColStyle}>
          {editMode
          ? <ValueCellEdit
            value={value}
            type={type}
            coordFormat={coordFormat}
            onChange={this.handleChange}
            fieldMetadata={fieldMetadata} />
          : <ValueCell value={value} type={type} coordFormat={coordFormat} />}
        </TableRowColumn>
        {editMode && <TableRowColumn style={{width: 48, padding: 0, verticalAlign: 'top'}}>
          <IconButton
            disableTouchRipple
            tooltip={<FormattedMessage {...messages.visibility} />}
            onTouchTap={this.handleVisibilityChange}>
            {hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </TableRowColumn>}
      </TableRow>
    )
  }
}

class FeatureTable extends React.PureComponent {
  static defaultProps = {
    feature: {
      properties: {}
    }
  }

  state = {
    width: '50%',
    rows: []
  }

  componentWillMount () {
    this.setState({rows: getRows(this.props)})
  }

  componentDidMount () {
    this.autoFitColumn()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.feature === this.props.feature &&
      nextProps.editMode === this.props.editMode &&
      nextProps.hiddenFields === this.props.hiddenFields) return
    this.setState({rows: getRows(nextProps)})
  }

  componentDidUpdate (prevProps, prevState) {
    const rows = this.state.rows
    const didFeaturePropKeysChange = rows
      .reduce((acc, row, i) => acc || row.key !== prevState.rows[i].key, false)
    if (didFeaturePropKeysChange) {
      this.autoFitColumn()
    }
  }

  autoFitColumn () {
    let width = 0
    this.state.rows.forEach(row => {
      var rowEl = this.refs[row.key].refs.firstColumn
      width = Math.max(width, rowEl.offsetWidth)
    })
    this.setState({
      width: width + 1
    })
  }

  render () {
    const {print, editMode, fieldAnalysis} = this.props
    const {rows} = this.state
    const firstColStyle = assign({}, styles.firstColumn, {width: this.state.width})
    let secondColStyle = styles.secondColumn
    if (print) {
      assign(firstColStyle, styles.smallRow)
      secondColStyle = assign({}, secondColStyle, styles.smallRow)
    }
    if (editMode) {
      secondColStyle = assign({}, secondColStyle, styles.editRow, styles.secondColumnEdit)
    }
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false} preScanRows={false}>
          {rows.map((row, index) => (
            <Row
              ref={row.key}
              {...row}
              _key={row.key}
              {...this.props}
              fieldMetadata={fieldAnalysis.properties[row.key]}
              firstColStyle={firstColStyle}
              secondColStyle={secondColStyle}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    )
  }
}

const isNonEditableFieldType = {
  [FIELD_TYPE_UUID]: true,
  [FIELD_TYPE_IMAGE]: true,
  [FIELD_TYPE_VIDEO]: true,
  [FIELD_TYPE_MEDIA]: true,
  [FIELD_TYPE_AUDIO]: true
}

function getRows (props) {
  const {feature, editMode, fieldAnalysis, hiddenFields} = props
  let rows = Object.keys(fieldAnalysis.properties)
      .map(key => ({
        key: key,
        value: feature.properties[key],
        type: fieldAnalysis.properties[key].type,
        hidden: hiddenFields.indexOf(key) > -1
      }))
      .filter(row => !isNonEditableFieldType[row.type])
  if (!editMode) {
    rows = rows.filter(row => typeof row.value !== 'undefined' &&
      hiddenFields.indexOf(row.key) === -1)
  }
  if (feature.geometry || editMode) {
    rows.unshift({
      key: 'location',
      value: feature.geometry && feature.geometry.coordinates,
      type: FIELD_TYPE_LOCATION,
      hidden: hiddenFields.indexOf('location') > -1
    })
  }
  return rows
}

export default FeatureTable
