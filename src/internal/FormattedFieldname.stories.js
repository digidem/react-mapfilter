// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'

// import { action } from '@storybook/addon-actions'

import FormattedFieldname from './FormattedFieldname'
import { FieldnameTranslationProvider } from '../Providers'

storiesOf('internal/FormattedFieldname', module)
  .add('Plain text', () => <FormattedFieldname fieldkey="foo" />)
  .add('Nested fieldname', () => <FormattedFieldname fieldkey="foo.bar.qux" />)
  .add('Underscores to spaces', () => (
    <FormattedFieldname fieldkey="foo_bob.bar.qux_hub" />
  ))
  .add('With translations', () => (
    <FieldnameTranslationProvider value={{ foo: 'Foo Translation' }}>
      <FormattedFieldname fieldkey="foo" />
    </FieldnameTranslationProvider>
  ))
  .add('Nested with translations', () => (
    <FieldnameTranslationProvider value={{ bar: 'Bar translation' }}>
      <FormattedFieldname fieldkey="foo.bar" />
    </FieldnameTranslationProvider>
  ))
  .add('Nested with translations reverse', () => (
    <FieldnameTranslationProvider value={{ bar: 'Bar translation' }}>
      <FormattedFieldname fieldkey="bar.foo" />
    </FieldnameTranslationProvider>
  ))
  .add('With full key translation', () => (
    <FieldnameTranslationProvider
      value={{
        'foo.bar.quux': 'foo.bar.qux Translation'
      }}>
      <FormattedFieldname fieldkey="foo.bar.quux" />
    </FieldnameTranslationProvider>
  ))
