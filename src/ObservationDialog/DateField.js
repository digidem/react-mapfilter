import React from 'react'
import { DatePicker } from '@material-ui/pickers'
import { leftPad } from '../utils/helpers'

const shortDateRegExp = /^(\d{4})-(\d{2})-(\d{2})$/

const DateField = ({ value, onChange, ...otherProps }) => {
  const valueAsDate = parseDateString(value)
  return (
    <DatePicker
      fullWidth
      variant="inline"
      inputVariant="outlined"
      margin="normal"
      value={valueAsDate}
      onChange={date => onChange(getDateString(date))}
      {...otherProps}
    />
  )
}

export default DateField

function getDateString(date) {
  if (!(date instanceof Date)) return
  const YYYY = date.getFullYear()
  const MM = leftPad(date.getMonth() + 1 + '', 2, '0')
  const DD = leftPad(date.getDate() + '', 2, '0')
  return `${YYYY}-${MM}-${DD}`
}

/**
 * This is necessary because Date.parse() of a string of the form 'YYYY-MM-DD'
 * will assume the timezone is UTC, so in different timezones the returned date
 * will not be what is expected.
 */
function parseDateString(str) {
  if (!str) return
  const match = str.match(shortDateRegExp)
  if (!match) {
    const date = Date.parse(str)
    return Number.isNaN(date) ? undefined : date
  }
  return new Date(+match[1], match[2] - 1, +match[3])
}
