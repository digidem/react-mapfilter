import React from 'react'
// import {Table, TableBody, TableRow, div} from 'material-ui/Table'
import {FormattedMessage, defineMessages} from 'react-intl'
import assign from 'object-assign'

import {createMessage as msg} from '../../util/intl_helpers'
import FormattedValue from '../shared/formatted_value'
import FormattedFieldname from '../shared/formatted_fieldname'
import IconButton from 'material-ui/IconButton'
import VisibilityIcon from 'material-ui/svg-icons/action/visibility'
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import makePure from 'recompose/pure'

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
    padding: 12,
    whiteSpace: 'normal',
    flex: 1
  },
  secondColumnEdit: {
    padding: '0 12px'
  },
  row: {
    maxHeight: 50,
    display: 'flex'
  },
  smallRow: {
    paddingTop: 4,
    paddingBottom: 4
  },
  textField: {
    fontSize: 14,
    lineHeight: '17px',
    height: 39,
    marginTop: -12
  },
  fieldUnderline: {
    bottom: 4,
    borderBottom: '1px dashed #c0c0c0',
    borderColor: '#c0c0c0'
  }
}

const ValueCell = ({value, type, coordFormat}) => (
  <FormattedValue value={value} type={type} coordFormat={coordFormat} />
)

const ValueCellEdit = makePure(({value, type, coordFormat, fieldMetadata = {}, onChange}) => {
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
})

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
    this.props.onVisibilityChange(this.props._key, !this.props.visible)
  }

  render () {
    const {_key, value, type, visible, editMode, coordFormat, fieldMetadata, firstColWidth} = this.props
    const rowStyle = assign({}, styles.row, {opacity: visible ? 1 : 0.6, borderBottomColor: editMode ? '#f0f0f0' : '#e0e0e0'})
    return (
      <div key={_key} style={rowStyle}>
        <div style={assign({}, styles.column, styles.firstColumn, {width: firstColWidth})}>
          <span ref={'firstColumn'}>
            <FormattedFieldname fieldname={_key} />
          </span>
        </div>
        <div style={assign({}, styles.column, editMode && {minHeight: 50})}>
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
          <IconButton
            style={{width: 39, height: 39, padding: 5}}
            disableTouchRipple
            onTouchTap={this.handleVisibilityChange}>
            {visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
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
    const {print, editMode, fieldAnalysis} = this.props
    const {rows} = this.state
    // const firstColStyle = assign({}, styles.firstColumn, {width: this.state.width})
    // let secondColStyle = styles.secondColumn
    // if (print) {
    //   assign(firstColStyle, styles.smallRow)
    //   secondColStyle = assign({}, secondColStyle, styles.smallRow)
    // }
    // if (editMode) {
    //   secondColStyle = assign({}, secondColStyle, styles.editRow, styles.secondColumnEdit)
    // }
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
  return rows.sort((a, b) => {
    const orderA = fieldOrder.hasOwnProperty(a.key) ? fieldOrder[a.key] : Infinity
    const orderB = fieldOrder.hasOwnProperty(b.key) ? fieldOrder[b.key] : Infinity
    return orderA - orderB
  })
}

export default FeatureTable
