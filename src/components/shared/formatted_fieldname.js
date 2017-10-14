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
  const groupText = parts.slice(0, -1)
  const fieldText = parts.slice(-1)[0]
  return <span>
    {groupText.map((t, i) => <span style={styles.groupText} key={i}>
      <FormattedMessage {...msg('field_key')(t)} />{' / '}
    </span>)}
    <span style={styles.fieldText}>
      <FormattedMessage {...msg('field_key')(fieldText)} />
    </span>
  </span>
}

export default injectIntl(FormattedFieldname)
