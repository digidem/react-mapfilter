// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'

// import { action } from '@storybook/addon-actions'

import FormattedFieldname from './FormattedFieldname'
import { FieldnameTranslationContext } from './Context'

storiesOf('internal/FormattedFieldname', module)
  .add('Plain text', () => <FormattedFieldname fieldkey="foo" />)
  .add('Nested fieldname', () => {
    const key = 'foo\uffffbar\uffffqux'
    return <FormattedFieldname fieldkey={key} />
  })
  .add('Underscores to spaces', () => {
    const key = 'foo_bob\uffffbar\uffffqux_hub'
    return <FormattedFieldname fieldkey={key} />
  })
  .add('With translations', () => (
    <FieldnameTranslationContext.Provider value={{ foo: 'Foo Translation' }}>
      <FormattedFieldname fieldkey="foo" />
    </FieldnameTranslationContext.Provider>
  ))
  .add('Nested with translations', () => {
    const key = 'foo\uffffbar'
    return (
      <FieldnameTranslationContext.Provider value={{ bar: 'Bar translation' }}>
        <FormattedFieldname fieldkey={key} />
      </FieldnameTranslationContext.Provider>
    )
  })
  .add('Nested with translations reverse', () => (
    <FieldnameTranslationContext.Provider value={{ bar: 'Bar translation' }}>
      <FormattedFieldname fieldkey={'bar\ufffffoo'} />
    </FieldnameTranslationContext.Provider>
  ))
  .add('With full key translation', () => (
    <FieldnameTranslationContext.Provider
      value={{
        'foo.bar.quux': 'foo.bar.qux Translation'
      }}>
      <FormattedFieldname fieldkey={'foo\uffffbar\uffffquux'} />
    </FieldnameTranslationContext.Provider>
  ))
