// @flow
import * as React from 'react'
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
import memoizeOne from 'memoize-one'

import FormattedValue from './FormattedValue'
import FormattedFieldname from '../internal/FormattedFieldname'
// import Select from '../internal/Select'
// import MultiSelect from '../internal/MultiSelect'
import { flattenFeature } from '../utils/features'

// import * as FIELD_TYPES from '../constants/field_types'
import * as FIELDKEYS from '../constants/special_fieldkeys'

import type { PointFeature, Classes } from '../types'

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

// eslint-disable-next-line no-unused-vars
type FieldDefinition = {
  // key on Feature.properties that this field applies to
  key: string,
  // the type of field to show (defaults to a guess based on valueType)
  type: string,
  // the type of the value
  valueType: string,
  // label to show for the field key (can be translated)
  label: string,
  // whether new options may be created, or must be an option from the list
  strict: boolean,
  // an ordered list of options to show for a select or multi-select field
  // where value is the value to be set, and label is the translation to show
  options: Array<string | {| value: number | string | boolean, label: string |}>
}

type Props = {
  editMode: boolean,
  classes: Classes<typeof styles>,
  feature: PointFeature,
  onValueChange: () => any,
  width: number
}

class FeatureTable extends React.Component<Props> {
  static defaultProps = {
    editMode: false,
    onValueChange: () => null,
    width: 800
  }

  getRows = memoizeOne(getRows)

  renderEditableCell(fieldkey, value) {
    return null
  }

  renderCell(fieldkey, value) {
    return (
      <Typography>
        <FormattedValue fieldkey={fieldkey} value={value} />
      </Typography>
    )
  }

  render() {
    const { classes, editMode, feature, width } = this.props
    const rows = this.getRows(feature, editMode)
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
      </Table>
    )
  }
}

// TODO: Does not actually work and memoize anything because props.feature
// changes every edit
function getRows(
  feature: PointFeature,
  // If true then render "empty" fields, i.e. fields with no value
  withEmpty: boolean = false
): Array<{ fieldkey: string, value: any }> {
  const flattenedFeature = flattenFeature(feature)
  const fieldkeys = Object.keys(flattenedFeature.properties || {})
  const rows = fieldkeys
    .map(fieldkey => ({
      fieldkey: fieldkey,
      value: (flattenedFeature.properties || {})[fieldkey]
    }))
    .filter(row => withEmpty || !isEmptyValue(row.value))

  // We add the location as the first row
  if (feature.geometry) {
    rows.unshift({
      fieldkey: FIELDKEYS.LOCATION,
      value: feature.geometry.coordinates
    })
  }
  return rows
}

function isEmptyValue(value) {
  return (
    (typeof value === 'string' && value.length === 0) ||
    value === undefined ||
    value === null
  )
}

export default withStyles(styles)(FeatureTable)
