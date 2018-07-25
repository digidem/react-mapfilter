import React from 'react'
import {FormattedMessage, injectIntl} from 'react-intl'

import {createMessage as msg} from '../../util/intl_helpers'

const styles = {
  groupText: {
    fontSize: '0.875em',
    color: 'rgba(0, 0, 0, 0.541176)'
  }
}

const FormattedFieldname = ({fieldname, children, intl}) => {
  if (!fieldname) return null
  const parts = fieldname.split('.')
  let message
  if (parts.length === 1) {
    message = msg('field_key')(fieldname)
    if (typeof children === 'function') {
      return children(intl.formatMessage(message))
    } else {
      return <FormattedMessage {...message} />
    }
  }
  if (typeof children === 'function') {
    return children(parts.join(' / '))
  }
  const groupText = parts.slice(0, -1).map(t => (
    intl.formatMessage(msg('field_key')(t)) + ' / '
  )).join('')
  const fieldText = intl.formatMessage(msg('field_key')(parts.slice(-1)[0]))
  return <span title={groupText + fieldText}>
    <span style={styles.groupText}>
      {groupText}
    </span>
    <span style={styles.fieldText}>
      {fieldText}
    </span>
  </span>
}

export default injectIntl(FormattedFieldname)
