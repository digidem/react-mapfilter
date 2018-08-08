// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'

// import { action } from '@storybook/addon-actions'

import FormattedFieldname from './FormattedFieldname'
import FieldTranslationProvider from '../FieldTranslationProvider'

storiesOf('internal/FormattedFieldname', module)
  .add('Plain text', () => <FormattedFieldname fieldkey="foo" />)
  .add('Nested fieldname', () => <FormattedFieldname fieldkey="foo.bar.qux" />)
  .add('Underscores to spaces', () => (
    <FormattedFieldname fieldkey="foo_bob.bar.qux_hub" />
  ))
  .add('With translations', () => (
    <FieldTranslationProvider
      value={{ fieldnameTranslations: { foo: 'Foo Translation' } }}>
      <FormattedFieldname fieldkey="foo" />
    </FieldTranslationProvider>
  ))
  .add('Nested with translations', () => (
    <FieldTranslationProvider
      value={{ fieldnameTranslations: { bar: 'Bar translation' } }}>
      <FormattedFieldname fieldkey="foo.bar" />
    </FieldTranslationProvider>
  ))
  .add('Nested with translations reverse', () => (
    <FieldTranslationProvider
      value={{ fieldnameTranslations: { bar: 'Bar translation' } }}>
      <FormattedFieldname fieldkey="bar.foo" />
    </FieldTranslationProvider>
  ))
  .add('With full key translation', () => (
    <FieldTranslationProvider
      value={{
        fieldnameTranslations: { 'foo.bar.quux': 'foo.bar.qux Translation' }
      }}>
      <FormattedFieldname fieldkey="foo.bar.quux" />
    </FieldTranslationProvider>
  ))
