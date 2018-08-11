// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import FeatureTable from './FeatureTable'
import FieldTranslationProvider from '../FieldTranslationProvider'

const translations = {
  fieldnameTranslations: {
    field1: 'Field one translation',
    field2: 'Field two translation',
    'nested.foo': 'nested field translation'
  },
  valueTranslations: {
    field1: {
      hello: 'Hello translation'
    },
    field2: { foo: 'Foo translation' },
    'nested.foo': { bar: 'bar translation' }
  }
}

storiesOf('internal/FeatureTable', module)
  .add('empty', () => (
    <FeatureTable feature={{ type: 'Feature', geometry: null }} />
  ))
  .add('basic', () => (
    <FeatureTable
      feature={{
        type: 'Feature',
        geometry: null,
        properties: {
          string: 'hello',
          number: 1,
          boolean: true,
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
      }}
    />
  ))
  .add('translations', () => (
    <FieldTranslationProvider value={translations}>
      <FeatureTable
        feature={{
          type: 'Feature',
          geometry: null,
          properties: {
            field1: 'hello',
            field2: ['foo', 'bar'],
            nested: {
              foo: 'bar'
            }
          }
        }}
      />
    </FieldTranslationProvider>
  ))
  .add('coordinates', () => (
    <FeatureTable
      feature={{
        geometry: {
          type: 'Point',
          coordinates: [-70, 2]
        }
      }}
    />
  ))
