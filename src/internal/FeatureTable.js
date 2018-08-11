// @flow
import React from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
// import TextField from '@material-ui/core/TextField'
// import Input from '@material-ui/core/Input'
// import MenuItem from '@material-ui/core/MenuItem'
// import MUISelect from '@material-ui/core/Select'
// import makePure from 'recompose/pure'
import classNames from 'classnames'
import union from 'lodash/union'
import memoizeOne from 'memoize-one'

import FormattedValue from '../internal/FormattedValue'
import FormattedFieldname from '../internal/FormattedFieldname'
// import Select from '../internal/Select'
// import MultiSelect from '../internal/MultiSelect'
import { flattenFeature } from '../utils/features'

// import * as FIELD_TYPES from '../constants/field_types'
import * as VALUE_TYPES from '../constants/field_values'
import * as FIELDKEYS from '../constants/special_fieldkeys'

import type { FieldOrder, PointFeature, FieldTypes } from '../types'

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

// const shouldNotWrap = {
//   [FIELD_TYPES.UUID]: true,
//   [FIELD_TYPES.IMAGE_URL]: true,
//   [FIELD_TYPES.VIDEO_URL]: true,
//   [FIELD_TYPES.MEDIA_URL]: true,
//   [FIELD_TYPES.AUDIO_URL]: true
// }

// const ValueCellEdit = makePure(
//   ({
//     value,
//     type,
//     rowKey,
//     coordFormat,
//     fieldMetadata = {},
//     onChange,
//     classes
//   }) => {
//     const suggestions =
//       Array.isArray(fieldMetadata.values) &&
//       fieldMetadata.values.map(d => d.value)
//     const isDiscreteField =
//       type === FIELD_TYPES.STRING &&
//       fieldMetadata.values &&
//       fieldMetadata.values.length / fieldMetadata.count < 0.8
//     if (isDiscreteField) {
//       return (
//         <Select
//           value={value}
//           onChange={(e, { newValue, type }) => onChange(rowKey, newValue)}
//           suggestions={suggestions}
//           style={styles.selectField}
//         />
//       )
//     }
//     if (type === FIELD_TYPES.BOOLEAN) {
//       return (
//         <MUISelect
//           MenuProps={{ MenuListProps: { dense: true } }}
//           fullWidth
//           autoWidth
//           value={value + ''}
//           onChange={e => {
//             const newValue =
//               e.target.value === 'true'
//                 ? true
//                 : e.target.value === 'false'
//                   ? false
//                   : undefined
//             onChange(rowKey, newValue)
//           }}
//           input={<Input className={classes.input} />}
//           style={styles.muiSelect}>
//           <MenuItem value="undefined" />
//           <MenuItem value="true">Yes</MenuItem>
//           <MenuItem value="false">No</MenuItem>
//         </MUISelect>
//       )
//     }
//     if (type === FIELD_TYPES.STRING) {
//       return (
//         <TextField
//           InputClassName={classes.input}
//           fullWidth
//           multiline
//           value={value}
//           onChange={e => onChange(rowKey, e.target.value)}
//           style={styles.textField}
//         />
//       )
//     }
//     if (type === FIELD_TYPES.ARRAY) {
//       return (
//         <MultiSelect
//           value={value}
//           onChange={(e, { newValue, type }) => onChange(rowKey, newValue)}
//           suggestions={suggestions}
//           style={styles.selectField}
//         />
//       )
//     }
//     return (
//       <ValueCell
//         value={value}
//         type={type}
//         coordFormat={coordFormat}
//         editMode
//         classes={classes}
//       />
//     )
//   }
// )

type Props = {
  editMode: boolean,
  classes: { [className: $Keys<typeof styles>]: string },
  hiddenFields: Array<string>,
  fieldTypes: FieldTypes,
  feature: PointFeature,
  fieldOrder: FieldOrder,
  onValueChange: () => any,
  width: number | string
}

class FeatureTable extends React.Component<Props> {
  static defaultProps = {
    editMode: false,
    hiddenFields: [],
    fieldTypes: {},
    fieldOrder: {},
    onValueChange: () => null,
    width: 600
  }

  getRows = memoizeOne(getRows)

  renderEditableCell(fieldkey, value) {
    return null
  }

  renderCell(fieldkey, value) {
    const { fieldTypes } = this.props
    return (
      <Typography>
        <FormattedValue
          fieldkey={fieldkey}
          value={value}
          type={fieldTypes[fieldkey]}
        />
      </Typography>
    )
  }

  render() {
    const {
      classes,
      editMode,
      feature,
      fieldOrder,
      fieldTypes,
      hiddenFields,
      width
    } = this.props
    const rows = this.getRows(
      editMode,
      feature,
      fieldOrder,
      fieldTypes,
      hiddenFields
    )
    return (
      <Table className={classes.root} style={{ width: width }}>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              className={classes.row}
              style={{ zIndex: rows.length - i }}>
              <TableCell
                padding="dense"
                className={classes.col1}
                style={{ maxWidth: width / 3 - 36 }}>
                <Typography className={classes.col1Text}>
                  <FormattedFieldname fieldkey={row.fieldkey} />
                </Typography>
              </TableCell>
              <TableCell
                padding="dense"
                className={classNames(classes.col2, {
                  [classes.col2Edit]: editMode
                })}>
                {editMode
                  ? this.renderEditableCell(row.fieldkey, row.value)
                  : this.renderCell(row.fieldkey, row.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {(console.log('autosizer', width), null)}
      </Table>
    )
  }
}

// TODO: Does not actually work and memoize anything because props.feature
// changes every edit
function getRows(
  editMode: boolean = false,
  feature: PointFeature,
  fieldOrder: { [fieldkey: string]: number } = {},
  fieldTypes: FieldTypes,
  hiddenFields: Array<string> = []
) {
  const flattenedFeature = flattenFeature(feature)
  const fieldkeys = union(
    Object.keys(flattenedFeature.properties || {}),
    Object.keys(fieldTypes)
  )
  const rows = fieldkeys
    .map(fieldkey => ({
      fieldkey: fieldkey,
      value: (flattenedFeature.properties || {})[fieldkey]
    }))
    .filter(
      row =>
        editMode ||
        (hiddenFields.indexOf(row.fieldkey) === -1 &&
          (typeof row.value !== 'string' || row.value.length) &&
          row.value !== undefined &&
          row.value !== null &&
          row.value !== VALUE_TYPES.UNDEFINED)
    )

  if (feature.geometry) {
    rows.unshift({
      fieldkey: FIELDKEYS.LOCATION,
      value: feature.geometry.coordinates
    })
  }

  // Sort rows by `fieldOrder` from state, if an order is set, if not then sort lexically.
  return rows.sort((a, b) => {
    var orderA =
      fieldOrder[a.fieldkey] !== undefined ? fieldOrder[a.fieldkey] : Infinity
    var orderB =
      fieldOrder[b.fieldkey] !== undefined ? fieldOrder[b.fieldkey] : Infinity
    if (orderA === Infinity && orderB === Infinity) {
      return lexicalSort(a, b)
    } else {
      return orderA - orderB
    }
  })
}

function lexicalSort(a, b) {
  var nameA = a.fieldkey.toUpperCase() // ignore upper and lowercase
  var nameB = b.fieldkey.toUpperCase() // ignore upper and lowercase
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
