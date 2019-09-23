import React from 'react'
import {FormattedMessage, FormattedDate} from 'react-intl'

import formatLocation from '../../util/formatLocation'
import { parseDate } from '../../util/filter_helpers'
import { createMessage as msg } from '../../util/intl_helpers'
import {
  FIELD_TYPE_DATE,
  FIELD_TYPE_ARRAY,
  FIELD_TYPE_LOCATION,
  FIELD_TYPE_NUMBER,
  FORMATS_DEG_MIN_SEC,
  FIELD_TYPE_IMAGE,
  FIELD_TYPE_VIDEO,
  FIELD_TYPE_MEDIA,
  FIELD_TYPE_AUDIO,
  FIELD_TYPE_LINK,
  FIELD_TYPE_UUID,
  FIELD_TYPE_FILENAME,
  UNDEFINED_KEY
} from '../../constants'

const FormattedValue = ({value, type, coordFormat = FORMATS_DEG_MIN_SEC}) => {
  switch (type) {
    case FIELD_TYPE_DATE:
      return <FormattedDate
        value={parseDate(value)}
        year='numeric'
        month='long'
        day='2-digit' />
    case FIELD_TYPE_ARRAY:
      return (value || []).map((v, idx) => <FormattedMessage key={idx} {...msg('field_value')(value)} />)
    case FIELD_TYPE_LOCATION:
      return <span>{formatLocation(value, coordFormat)}</span>
    case FIELD_TYPE_NUMBER:
      return <span>{value === UNDEFINED_KEY ? '' : value + ''}</span>
    case FIELD_TYPE_UUID:
    case FIELD_TYPE_FILENAME:
      return <span>{value}</span>
    case FIELD_TYPE_IMAGE:
    case FIELD_TYPE_VIDEO:
    case FIELD_TYPE_MEDIA:
    case FIELD_TYPE_AUDIO:
    case FIELD_TYPE_LINK:
      return <a href={value} target='_blank'>{value}</a>
    default:
      return <FormattedMessage {...msg('field_value')(value)} />
  }
}

export default FormattedValue
