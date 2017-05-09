import React from 'react'
import {FormattedMessage} from 'react-intl'

import {createMessage as msg} from '../../util/intl_helpers'

const styles = {
  groupText: {
    fontSize: '0.875em',
    color: 'rgba(0, 0, 0, 0.541176)'
  }
}

const FormattedFieldname = ({fieldname}) => {
  const parts = fieldname.split('.')
  if (parts.length === 1) return <FormattedMessage {...msg('field_key')(fieldname)} />

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

export default FormattedFieldname
