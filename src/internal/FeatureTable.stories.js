// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import FeatureTable from './FeatureTable'
import {
  FieldnameTranslationProvider,
  ValueTranslationProvider
} from '../Providers'

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

storiesOf('internal/FeatureTable', module)
  .add('empty', () => (
    <FeatureTable
      feature={{ type: 'Feature', properties: null, geometry: null }}
    />
  ))
  .add('basic', () => (
    <FeatureTable
      feature={{
        type: 'Feature',
        geometry: null,
        properties: {
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
      }}
    />
  ))
  .add('translations', () => (
    <FieldnameTranslationProvider value={fieldnameTranslations}>
      <ValueTranslationProvider value={valueTranslations}>
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
      </ValueTranslationProvider>
    </FieldnameTranslationProvider>
  ))
  .add('coordinates', () => (
    <FeatureTable
      feature={{
        type: 'Feature',
        properties: null,
        // $FlowFixMe - yeah just ignore this for now
        geometry: {
          type: 'Point',
          coordinates: [-70, 2]
        }
      }}
    />
  ))
