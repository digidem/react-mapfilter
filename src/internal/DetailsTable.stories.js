// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import DetailsTable from './DetailsTable'
import { getFields } from '../lib/data_analysis'
import {
  FieldnameTranslationContext,
  ValueTranslationContext
} from './Context.js'

const fieldnameTranslations = {
  field1: 'Field one translation',
  field2: 'Field two translation',
  'nested.foo': 'nested field translation'
}
const valueTranslations = {
  field1: {
    hello: 'Hello translation'
  },
  field2: { foo: 'Foo translation' },
  'nested.foo': { bar: 'bar translation' }
}

storiesOf('internal/DetailsTable', module)
  .add('empty', () => <DetailsTable />)
  .add('basic', () => {
    const tags = {
      string: 'hello',
      number: 1,
      bool: true,
      array: ['foo', 'bar'],
      nested: {
        foo: 'bar',
        qux: {
          deepNested: 'hello'
        }
      },
      null: null,
      undefined: undefined
    }
    const fields = getFields(tags)
    return <DetailsTable fields={fields} tags={tags} />
  })
  .add('translations', () => {
    const tags = {
      field1: 'hello',
      field2: ['foo', 'bar'],
      nested: {
        foo: 'bar'
      }
    }
    const fields = getFields(tags)
    return (
      <FieldnameTranslationContext.Provider value={fieldnameTranslations}>
        <ValueTranslationContext.Provider value={valueTranslations}>
          <DetailsTable fields={fields} tags={tags} />
        </ValueTranslationContext.Provider>
      </FieldnameTranslationContext.Provider>
    )
  })
