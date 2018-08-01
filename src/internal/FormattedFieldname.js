// @flow
import * as React from 'react'

import { Consumer as FieldTranslationConsumer } from './FieldTranslationContext'
import { translateOrPretty } from '../utils/strings'

const styles = {
  groupText: {
    fontSize: '0.875em',
    color: 'rgba(0, 0, 0, 0.541176)'
  }
}

type Props = {
  /* The field name, including a dot-delimited group, e.g. a field { foo: { bar:
  { qux: 'value' }}} would have a fieldKey `foo.bar.qux` */
  fieldKey: string,
  /* Optionally if you pass a function children, it will be called with the
  translated string as a React.Node */
  children?: (translatedMessage: React.Node) => React.Node
}

/** Takes a field key and either looks up a translation from Context or attempts
 * to pretty-print the fieldname by replacing `_` with spaces and transforming
 * to Title Case */
const FormattedFieldname = ({ fieldKey, children }: Props) => {
  if (!fieldKey) return null
  return (
    <FieldTranslationConsumer>
      {({ fieldnameTranslations: translations }) => {
        let element
        const parts = fieldKey.split('.')
        if (translations[fieldKey] || parts.length === 1) {
          const fieldText = translateOrPretty(fieldKey, translations)
          element = <span title={fieldText}>{fieldText}</span>
        } else {
          const fieldname = parts.pop()
          const groupText =
            parts.map(str => translateOrPretty(str, translations)).join(' / ') +
            ' / '
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
      }}
    </FieldTranslationConsumer>
  )
}

export default FormattedFieldname
