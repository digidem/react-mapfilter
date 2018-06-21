import React from 'react'
import PropTypes from 'prop-types'
import { createSelector } from 'reselect'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import classNames from 'classnames'

import FormattedValue from '../shared/FormattedValue'
import FormattedFieldname from '../shared/FormattedFieldname'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import MUISelect from '@material-ui/core/Select'
import Select from '../shared/Select'
import MultiSelect from '../shared/MultiSelect'
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
  FIELD_TYPE_AUDIO,
  UNDEFINED_KEY
} from '../../constants'

const styles = {
  root: {
    overflow: 'auto'
  },
  row: {
    verticalAlign: 'top',
    position: 'relative'
  },
  col1: {
    padding: '14px 12px 14px 24px'
  },
  col1Text: {
    fontWeight: 500,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    direction: 'rtl'
  },
  col2: {
    padding: '14px 24px 14px 12px !important',
    width: '100%',
    maxWidth: 0,
    whiteSpace: 'initial',
    fontSize: '0.875rem'
  },
  col2Edit: {
    paddingTop: '9px !important',
    paddingBottom: '9px !important'
  },
  col2TextEdit: {
    paddingTop: 5,
    paddingBottom: 5
  },
  col2TextNoWrap: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  input: {
    fontSize: 'inherit'
  }
}

const shouldNotWrap = {
  [FIELD_TYPE_UUID]: true,
  [FIELD_TYPE_MIXED]: true,
  [FIELD_TYPE_IMAGE]: true,
  [FIELD_TYPE_VIDEO]: true,
  [FIELD_TYPE_MEDIA]: true,
  [FIELD_TYPE_AUDIO]: true
}

const ValueCell = ({value, type, coordFormat, editMode, classes}) => (
  <Typography className={classNames({
    [classes.col2TextEdit]: editMode,
    [classes.col2TextNoWrap]: shouldNotWrap[type]
  })}>
    <FormattedValue value={value} type={type} coordFormat={coordFormat} />
  </Typography>
)

const ValueCellEdit = makePure(({value, type, rowKey, coordFormat, fieldMetadata = {}, onChange, classes}) => {
  const suggestions = Array.isArray(fieldMetadata.values) && fieldMetadata.values.map(d => d.value)
  const isDiscreteField = type === FIELD_TYPE_STRING && fieldMetadata.values &&
    fieldMetadata.values.length / fieldMetadata.count < 0.8
  if (isDiscreteField) {
    return <Select
      value={value}
      onChange={(e, {newValue, type}) => onChange(rowKey, newValue)}
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
        onChange(rowKey, newValue)
      }}
      input={<Input className={classes.input} />}
      style={styles.muiSelect}>
      <MenuItem value='undefined' />
      <MenuItem value='true'>Yes</MenuItem>
      <MenuItem value='false'>No</MenuItem>
    </MUISelect>
  }
  if (type === FIELD_TYPE_STRING || type === FIELD_TYPE_MIXED) {
    return <TextField
      InputClassName={classes.input}
      fullWidth
      multiline
      value={value}
      onChange={(e) => onChange(rowKey, e.target.value)}
      style={styles.textField} />
  }
  if (type === FIELD_TYPE_ARRAY) {
    return <MultiSelect
      value={value}
      onChange={(e, {newValue, type}) => onChange(rowKey, newValue)}
      suggestions={suggestions}
      style={styles.selectField} />
  }
  return <ValueCell value={value} type={type} coordFormat={coordFormat} editMode classes={classes} />
})

const FeatureTable = (props) => {
  const {editMode, classes, coordFormat, fieldAnalysis, onValueChange} = props
  const rows = getRows(props)
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <Table className={classes.root} style={{width: width}}>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i} className={classes.row} style={{zIndex: rows.length - i}}>
                <TableCell padding='dense' className={classes.col1} style={{maxWidth: width / 3 - 36}}>
                  <Typography className={classes.col1Text}>
                    <FormattedFieldname fieldname={row.key} />
                  </Typography>
                </TableCell>
                <TableCell padding='dense' className={classNames(classes.col2, {[classes.col2Edit]: editMode})}>
                  {editMode
                    ? <ValueCellEdit
                      value={row.value}
                      type={row.type}
                      rowKey={row.key}
                      coordFormat={coordFormat}
                      classes={classes}
                      onChange={onValueChange}
                      fieldMetadata={fieldAnalysis.properties[row.key]} />
                    : <ValueCell value={row.value} type={row.type} coordFormat={coordFormat} classes={classes} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AutoSizer>
  )
}

FeatureTable.propTypes = {
  hiddenFields: PropTypes.object.isRequired,
  fieldOrder: PropTypes.object.isRequired
}

FeatureTable.defaultProps = {
  hiddenFields: {},
  fieldOrder: {}
}

// TODO: Does not actually work and memoize anything because props.feature
// changes every edit
const getRows = createSelector(
  props => props.feature,
  props => props.fieldAnalysis,
  props => props.hiddenFields,
  props => props.fieldOrder,
  props => props.editMode,
  (feature, fieldAnalysis, hiddenFields, fieldOrder, editMode) => {
    const rows = Object.keys(fieldAnalysis.properties)
      .map(key => ({
        key: key,
        value: feature.properties[key],
        type: fieldAnalysis.properties[key].type,
        visible: !hiddenFields[key]
      }))
      .filter(row => editMode || (!hiddenFields[row.key] &&
        (typeof row.value !== 'string' || row.value.length) &&
        typeof row.value !== 'undefined' && row.value !== UNDEFINED_KEY))

    if (feature.geometry) {
      rows.unshift({
        key: 'location',
        value: feature.geometry && feature.geometry.coordinates,
        type: FIELD_TYPE_LOCATION,
        visible: !hiddenFields.location
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
)

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

export default withStyles(styles)(FeatureTable)
