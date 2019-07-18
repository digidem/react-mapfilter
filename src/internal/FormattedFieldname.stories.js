// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'

// import { action } from '@storybook/addon-actions'

import FormattedFieldname from './FormattedFieldname'

storiesOf('internal/FormattedFieldname', module)
  .add('Plain text', () => (
    <FormattedFieldname field={{ id: '1', type: 'text', key: 'foo' }} />
  ))
  .add('Nested fieldname', () => {
    const key = ['foo', 'bar', 'qux']
    return <FormattedFieldname field={{ id: '1', type: 'text', key: key }} />
  })
  .add('Underscores and dashes to spaces', () => {
    const key = ['foo_bob', 'bar', 'qux-hub']
    return <FormattedFieldname field={{ id: '1', type: 'text', key: key }} />
  })
  .add('With label', () => {
    const key = ['foo_bob', 'bar', 'qux_hub']
    return (
      <FormattedFieldname
        field={{ id: '1', type: 'text', key: key, label: 'A Field Label' }}
      />
    )
  })
  .add('Translated label', () => {
    const key = ['foo', 'bar']
    return (
      <FormattedFieldname
        field={{
          id: '1',
          type: 'text',
          key: key,
          label: 'English label',
          'label:es-PE': 'Peruvian-Spanish label',
          'label:es': 'Etiqueta Español'
        }}
      />
    )
  })
