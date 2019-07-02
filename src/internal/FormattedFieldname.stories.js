// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'

// import { action } from '@storybook/addon-actions'

import FormattedFieldname from './FormattedFieldname'
import { FieldnameTranslationContext } from './Context'

storiesOf('internal/FormattedFieldname', module)
  .add('Plain text', () => <FormattedFieldname field={{ key: 'foo' }} />)
  .add('Nested fieldname', () => {
    const key = 'foo\uffffbar\uffffqux'
    return <FormattedFieldname field={{ key: key }} />
  })
  .add('Underscores to spaces', () => {
    const key = 'foo_bob\uffffbar\uffffqux_hub'
    return <FormattedFieldname field={{ key: key }} />
  })
  .add('With translations', () => (
    <FieldnameTranslationContext.Provider value={{ foo: 'Foo Translation' }}>
      <FormattedFieldname field={{ key: 'foo' }} />
    </FieldnameTranslationContext.Provider>
  ))
  .add('Nested with translations', () => {
    const key = 'foo\uffffbar'
    return (
      <FieldnameTranslationContext.Provider value={{ bar: 'Bar translation' }}>
        <FormattedFieldname field={{ key: key }} />
      </FieldnameTranslationContext.Provider>
    )
  })
  .add('Nested with translations reverse', () => (
    <FieldnameTranslationContext.Provider value={{ bar: 'Bar translation' }}>
      <FormattedFieldname field={{ key: 'bar\ufffffoo' }} />
    </FieldnameTranslationContext.Provider>
  ))
  .add('With full key translation', () => (
    <FieldnameTranslationContext.Provider
      value={{
        'foo.bar.quux': 'foo.bar.qux Translation'
      }}>
      <FormattedFieldname field={{ key: 'foo\uffffbar\uffffquux' }} />
    </FieldnameTranslationContext.Provider>
  ))
