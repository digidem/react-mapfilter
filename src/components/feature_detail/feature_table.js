import React from 'react'
// import {Table, TableBody, TableRow, div} from 'material-ui/Table'
import assign from 'object-assign'

import {createMessage as msg} from '../../util/intl_helpers'
import FormattedValue from '../shared/formatted_value'
import FormattedFieldname from '../shared/formatted_fieldname'
import IconButton from 'material-ui/IconButton'
import VisibilityIcon from 'material-ui-icons/Visibility'
import VisibilityOffIcon from 'material-ui-icons/VisibilityOff'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Input from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import MUISelect from 'material-ui/Select'
import Select from '../shared/select'
import MultiSelect from '../shared/multi_select'
import makePure from 'recompose/pure'
import Tooltip from 'material-ui/Tooltip'
import { FormattedMessage, defineMessages } from 'react-intl'

import {
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

const styles = {
  firstColumn: {
    fontWeight: 'bold',
    flex: 'initial',
    textAlign: 'right'
  },
  column: {
    padding: '12px 12px',
    whiteSpace: 'normal',
    flex: 1
  },
  secondColumnEdit: {
    padding: '0 12px'
  },
  row: {
    lineHeight: 1.4,
    display: 'flex',
    position: 'relative'
  },
  smallRow: {
    paddingTop: 4,
    paddingBottom: 4
  },
  textField: {
    fontSize: 14,
    marginTop: -2
  },
  muiSelect: {
    fontSize: 14,
    marginTop: -4
  },
  selectField: {
    fontSize: 14,
    marginTop: -3
  },
  fieldUnderline: {
    bottom: 4,
    borderBottom: '1px dashed #c0c0c0',
    borderColor: '#c0c0c0'
  }
}

const ValueCell = ({value, type, coordFormat}) => (
  <Typography>
    <FormattedValue value={value} type={type} coordFormat={coordFormat} />
  </Typography>
)

const ValueCellEdit = makePure(({value, type, coordFormat, fieldMetadata = {}, onChange}) => {
  const suggestions = Array.isArray(fieldMetadata.values) && fieldMetadata.values.map(d => d.value)
  const isDiscreteField = type === FIELD_TYPE_STRING && fieldMetadata.values &&
    fieldMetadata.values.length / fieldMetadata.count < 0.8
  if (isDiscreteField) {
    return <Select
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      style={styles.selectField} />
  }
  if (type === FIELD_TYPE_BOOLEAN) {
    return <MUISelect
      MenuProps={{MenuListProps: {dense: true}}}
      fullWidth
      autoWidth
      value={value + ''}
      onChange={(e) => {
        const newValue = e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined
        onChange(e, {newValue})
      }}
      input={<Input />}
      style={styles.muiSelect}>
      <MenuItem value='undefined' />
      <MenuItem value='true'>Yes</MenuItem>
      <MenuItem value='false'>No</MenuItem>
    </MUISelect>
  }
  if (type === FIELD_TYPE_STRING || type === FIELD_TYPE_MIXED) {
    return <TextField
      fullWidth
      value={value}
      onChange={onChange}
      style={styles.textField} />
  }
  if (type === FIELD_TYPE_ARRAY) {
    return <MultiSelect
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      style={styles.selectField} />
  }
  return <ValueCell value={value} type={type} coordFormat={coordFormat} />
})

class Row extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  handleChange (e, {newValue, type}) {
    const value = typeof newValue === 'undefined' ? e.target.value : newValue
    this.props.onValueChange(this.props._key, value === 'undefined' ? undefined : value)
  }

  handleVisibilityChange () {
    this.props.onVisibilityChange(this.props._key, !this.props.visible)
  }

  render () {
    const {_key, value, type, visible, editMode, coordFormat, fieldMetadata, firstColWidth, style} = this.props
    const rowStyle = assign({}, styles.row, {color: visible ? 'initial' : '#999999'}, style)
    return (
      <div key={_key} style={rowStyle}>
        <Typography style={assign({}, styles.column, styles.firstColumn, {width: firstColWidth, color: 'inherit'})}>
          <span ref={'firstColumn'}>
            <FormattedFieldname fieldname={_key} />
          </span>
        </Typography>
        <div style={assign({}, styles.column, editMode && {minHeight: 30})}>
          {editMode
          ? <ValueCellEdit
            key={_key}
            value={value}
            type={type}
            coordFormat={coordFormat}
            onChange={this.handleChange}
            fieldMetadata={fieldMetadata} />
          : <ValueCell key={_key} value={value} type={type} coordFormat={coordFormat} />}
        </div>
        {editMode && <div style={assign({}, styles.column, {padding: 0, flex: 'initial'})}>
          <Tooltip title={<FormattedMessage {...messages.visibility} />}>
            <IconButton
              style={{width: 39, height: 39, padding: 5, color: visible ? 'initial' : '#999999'}}
              onClick={this.handleVisibilityChange}>
              {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </Tooltip>
        </div>}
      </div>
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
      nextProps.visibleFields === this.props.visibleFields) return
    this.setState({rows: getRows(nextProps)})
  }

  componentDidUpdate (prevProps, prevState) {
    const rows = this.state.rows
    const didFeaturePropKeysChange = (rows.length !== prevState.rows.length) ||
      rows.reduce((acc, row, i) => acc || row.key !== prevState.rows[i].key, false)
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
    const {fieldAnalysis} = this.props
    const {rows} = this.state
    return (
      <div>
        {rows.map((row, index) => (
          <Row
            ref={row.key}
            {...row}
            _key={row.key}
            {...this.props}
            fieldMetadata={fieldAnalysis.properties[row.key]}
            firstColWidth={this.state.width}
            index={index}
            style={{zIndex: rows.length - index}}
          />
        ))}
      </div>
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
  const {feature, editMode, fieldAnalysis, visibleFields, fieldOrder} = props
  let rows = Object.keys(fieldAnalysis.properties)
      .map(key => ({
        key: key,
        value: feature.properties[key],
        type: fieldAnalysis.properties[key].type,
        visible: visibleFields.indexOf(key) > -1
      }))
      .filter(row => !isNonEditableFieldType[row.type])
  if (!editMode) {
    rows = rows.filter(row => visibleFields.indexOf(row.key) > -1 &&
      (typeof row.value !== 'string' || row.value.length) &&
      typeof row.value !== 'undefined')
  }
  if (feature.geometry || editMode) {
    rows.unshift({
      key: 'location',
      value: feature.geometry && feature.geometry.coordinates,
      type: FIELD_TYPE_LOCATION,
      visible: visibleFields.indexOf('location') > -1
    })
  }
  // Sort rows by `fieldOrder` from state, if an order is set, if not then sort lexically.
  return rows.sort((a, b) => {
    var orderA = typeof fieldOrder[a.key] !== 'undefined' ? fieldOrder[a.key] : Infinity
    var orderB = typeof fieldOrder[b.key] !== 'undefined' ? fieldOrder[b.key] : Infinity
    if (orderA === Infinity && orderB === Infinity) {
      return lexicalSort(a, b)
    } else {
      return orderA - orderB
    }
  })
}

function lexicalSort (a, b) {
  var nameA = a.key.toUpperCase() // ignore upper and lowercase
  var nameB = b.key.toUpperCase() // ignore upper and lowercase
  if (nameA < nameB) {
    return -1
  }
  if (nameA > nameB) {
    return 1
  }
  // names must be equal
  return 0
}

export default FeatureTable
