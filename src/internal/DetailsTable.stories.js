// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import DetailsTable from './DetailsTable'
import { getFields } from '../lib/data_analysis'

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
  .add('custom labels', () => {
    const tags = {
      field1: 'hello',
      field2: ['foo', 'bar'],
      nested: {
        foo: 'bar'
      }
    }
    const fields = getFields(tags)
    // $FlowFixMe
    fields.find(f => f.key[0] === 'field1').label = 'Field one translation'
    // $FlowFixMe
    fields.find(f => f.key[0] === 'field2').label = 'Field two translation'
    // $FlowFixMe
    fields.find(f => f.key[0] === 'nested').label = 'Nested translation'
    return <DetailsTable fields={fields} tags={tags} />
  })
