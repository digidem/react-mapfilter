// @flow
import React, { useState } from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import HideFieldsButton from './HideFieldsButton'

const initialFieldState = [
  { fieldkey: 'foo', hidden: false, label: 'Foo' },
  { fieldkey: 'bar', hidden: true, label: 'Bar' },
  { fieldkey: 'qux', hidden: false, label: 'Qux' }
]

storiesOf('ReportView/HideFieldsButton', module)
  .add('default', () => (
    <HideFieldsButton
      fieldState={initialFieldState}
      onFieldStateUpdate={action('field-state-update')}
    />
  ))
  .add('with state', () => {
    const WithState = () => {
      const [fieldState, setFieldState] = useState(initialFieldState)
      return (
        <HideFieldsButton
          fieldState={fieldState}
          onFieldStateUpdate={setFieldState}
        />
      )
    }
    return <WithState />
  })
