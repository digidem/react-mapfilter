// @flow
import * as React from 'react'

import { FieldnameTranslationContext } from './Context'
import { translateOrPretty } from '../utils/strings'
import type { Field } from '../types'

const styles = {
  groupText: {
    fontSize: '0.875em',
    color: 'rgba(0, 0, 0, 0.541176)'
  }
}

type Props = {
  field: Field,
  /* Optionally if you pass a function children, it will be called with the
  translated string as a React.Node */
  children?: (translatedMessage: React.Node) => React.Node
}

/** Takes a field key and either looks up a translation from Context or attempts
 * to pretty-print the fieldname by replacing `_` with spaces and transforming
 * to Title Case */
const FormattedFieldname = ({ field, children }: Props) => {
  if (field.label) return field.label
  const fieldkey = field.key
  if (!fieldkey) return null
  const translations = React.useContext(FieldnameTranslationContext)
  let element
  const parts = fieldkey.split('\uffff')
  const dotPropFieldKey = parts.join('.')
  if (translations[dotPropFieldKey] || parts.length === 1) {
    const fieldText = translateOrPretty(dotPropFieldKey, translations)
    element = <span title={fieldText}>{fieldText}</span>
  } else {
    const fieldname = parts.pop()
    const groupText =
      parts.map(str => translateOrPretty(str, translations)).join(' / ') + ' / '
    const fieldText = translateOrPretty(fieldname, translations)
    element = (
      <span title={groupText + fieldText}>
        <span style={styles.groupText}>{groupText}</span>
        <span>{fieldText}</span>
      </span>
    )
  }
  if (typeof children === 'function') {
    return children(element)
  } else {
    return element
  }
}

export default FormattedFieldname
