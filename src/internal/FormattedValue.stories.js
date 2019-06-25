// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import withPropsCombinations from 'react-storybook-addon-props-combinations'

// import { action } from '@storybook/addon-actions'

import FormattedValue from './FormattedValue'
import { ValueTranslationContext } from './Context'
import * as fieldTypes from '../constants/field_types'

storiesOf('internal/FormattedValue', module)
  .add('text from string', () => (
    <FormattedValue value="hello world" fieldType={fieldTypes.TEXT} />
  ))
  .add('text from bool', () => (
    <FormattedValue value={true} fieldType={fieldTypes.TEXT} />
  ))
  .add('text from number', () => (
    <FormattedValue value={2} fieldType={fieldTypes.TEXT} />
  ))
  .add('text from null', () => (
    <FormattedValue value={null} fieldType={fieldTypes.TEXT} />
  ))
  .add('date', () => (
    <FormattedValue
      value={new Date('2018-08-03T13:56:53.928Z')}
      fieldType={fieldTypes.DATE}
    />
  ))
  .add('date null', () => (
    <FormattedValue value={null} fieldType={fieldTypes.DATE} />
  ))
  .add('datetime', () => (
    <FormattedValue
      value={new Date('2018-08-03T13:56:53.928Z')}
      fieldType={fieldTypes.DATETIME}
    />
  ))
  .add('datetime null', () => (
    <FormattedValue value={null} fieldType={fieldTypes.DATETIME} />
  ))
  .add('number', () => (
    <FormattedValue value={2} fieldType={fieldTypes.NUMBER} />
  ))
  .add('select one boolean', () => (
    <FormattedValue value={true} fieldType={fieldTypes.SELECT_ONE} />
  ))
  .add('select one string', () => (
    <FormattedValue value="hello world" fieldType={fieldTypes.SELECT_ONE} />
  ))
  .add('select multiple', () => (
    <FormattedValue
      value={['foo', true, 2, null]}
      fieldType={fieldTypes.SELECT_MULTIPLE}
    />
  ))

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

storiesOf('internal/FormattedValue', module).add('text translations', () => (
  <ValueTranslationContext.Provider value={translations}>
    {withPropsCombinations(FormattedValue, {
      value: ['hello world', true, false, null],
      fieldkey: ['testFieldkey'],
      fieldType: [fieldTypes.TEXT]
    })()}
  </ValueTranslationContext.Provider>
))

storiesOf('internal/FormattedValue', module).add(
  'select multiple translations',
  () => (
    <ValueTranslationContext.Provider value={translations}>
      <FormattedValue
        value={['foo', 'bar']}
        fieldType={fieldTypes.SELECT_MULTIPLE}
        fieldkey="testFieldkey"
      />
    </ValueTranslationContext.Provider>
  )
)
