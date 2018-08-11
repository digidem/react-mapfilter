// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import withPropsCombinations from 'react-storybook-addon-props-combinations'

// import { action } from '@storybook/addon-actions'

import FormattedValue from './FormattedValue'
import FieldTranslationProvider from '../FieldTranslationProvider'
import SettingsProvider from '../SettingsProvider'
import * as fieldTypes from '../constants/field_types'
import { UNDEFINED, NULL } from '../constants/field_values'
import * as COORD_FORMATS from '../constants/coord_formats'

storiesOf('internal/FormattedValue', module).add(
  'plain values',
  withPropsCombinations(FormattedValue, {
    value: [
      'hello world',
      '2018-08-03T13:56:53.928Z',
      '2018-08-03',
      true,
      false,
      0,
      42,
      [1, 2],
      ['foo', 'bar'],
      undefined,
      UNDEFINED,
      null,
      NULL
    ]
  })
)

storiesOf('internal/FormattedValue', module).add(
  'type coercion',
  withPropsCombinations(FormattedValue, {
    value: [
      'hello world',
      '2018-08-03T13:56:53.928Z',
      '2018-08-03',
      true,
      false,
      0,
      42,
      [1, 2],
      ['foo', 'bar'],
      undefined,
      UNDEFINED,
      null,
      NULL
    ],
    type: [
      fieldTypes.STRING,
      fieldTypes.BOOLEAN,
      fieldTypes.NUMBER,
      fieldTypes.ARRAY,
      fieldTypes.LOCATION,
      fieldTypes.DATE
    ]
  })
)

const translations = {
  testFieldkey: {
    'hello world': 'Hola mundo',
    true: 'Sí',
    false: 'Falso',
    null: 'Sin valor',
    undefined: 'Sin Valor',
    foo: 'Translated foo'
  }
}

storiesOf('internal/FormattedValue', module)
  .add('translations', () => (
    <FieldTranslationProvider value={{ valueTranslations: translations }}>
      {withPropsCombinations(FormattedValue, {
        value: [
          'hello world',
          true,
          false,
          ['foo', 'bar'],
          undefined,
          UNDEFINED,
          null,
          NULL
        ],
        fieldkey: ['testFieldkey']
      })()}
    </FieldTranslationProvider>
  ))
  .add('deg-min-sec Location', () => (
    <SettingsProvider value={{ coordFormat: COORD_FORMATS.DEG_MIN_SEC }}>
      <FormattedValue value={[2.1234, 5.541]} type={fieldTypes.LOCATION} />
    </SettingsProvider>
  ))
  .add('decimal deg Location', () => (
    <SettingsProvider value={{ coordFormat: COORD_FORMATS.DEC_DEG }}>
      <FormattedValue value={[2.1234, 5.541]} type={fieldTypes.LOCATION} />
    </SettingsProvider>
  ))
