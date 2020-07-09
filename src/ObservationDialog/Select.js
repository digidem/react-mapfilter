// @flow
import React from 'react'
import TextField from './TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'

import type { SelectableFieldValue, SelectOptions } from '../types'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  container: {
    width: '100%'
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  inputRoot: {
    flexWrap: 'wrap'
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1
  },
  divider: {
    height: theme.spacing(2)
  }
}))

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

type Props = {
  id: string,
  value: SelectableFieldValue,
  placeholder?: string,
  onChange: (value: SelectableFieldValue) => any,
  options: SelectOptions
}

/**
 * A multi-select field that allows the user to enter a value that is not on the
 * list. Allows the selection of non-string values from a list, but the labels
 * for each item must be unique for this to work reliably
 */
export const SelectOne = ({
  id,
  value,
  label,
  options,
  placeholder,
  onChange,
  ...props
}: Props) => {
  const classes = useStyles()
  return (
    <Autocomplete
      id={id}
      value={value}
      onChange={(e, v) => onChange(v)}
      options={options.map(op => (typeof op === 'object' ? op.label : op))}
      renderInput={params =>
        renderInput({ ...params, classes, label, placeholder })
      }
      {...props}
    />
  )
}

export const SelectMultiple = ({
  id,
  value,
  label,
  options,
  placeholder,
  onChange,
  ...props
}: Props) => {
  const classes = useStyles()
  return (
    <Autocomplete
      id={id}
      multiple
      freeSolo
      value={value || []}
      onChange={(e, v) => onChange(v)}
      options={options.map(op => (typeof op === 'object' ? op.label : op))}
      renderInput={params =>
        renderInput({ ...params, classes, label, placeholder })
      }
      {...props}
    />
  )
}
