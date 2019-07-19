// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'
import withPropsCombinations from 'react-storybook-addon-props-combinations'

// import { action } from '@storybook/addon-actions'

import FormattedValue from './FormattedValue'
import * as fieldTypes from '../constants/field_types'

storiesOf('internal/FormattedValue', module)
  .add('text from string', () => (
    <FormattedValue
      value="hello world"
      field={{ id: '', key: [], type: fieldTypes.TEXT }}
    />
  ))
  .add('text from bool', () => (
    <FormattedValue
      value={true}
      field={{ id: '', key: [], type: fieldTypes.TEXT }}
    />
  ))
  .add('text from number', () => (
    <FormattedValue
      value={2}
      field={{ id: '', key: [], type: fieldTypes.TEXT }}
    />
  ))
  .add('text from null', () => (
    <FormattedValue
      value={null}
      field={{ id: '', key: [], type: fieldTypes.TEXT }}
    />
  ))
  .add('link', () => (
    <FormattedValue
      value="http://www.example.com"
      field={{ id: '', key: [], type: fieldTypes.LINK }}
    />
  ))
  .add('link but not link', () => (
    <FormattedValue
      value="not a link"
      field={{ id: '', key: [], type: fieldTypes.LINK }}
    />
  ))
  .add('link from null', () => (
    <FormattedValue
      value={null}
      field={{ id: '', key: [], type: fieldTypes.LINK }}
    />
  ))
  .add('date', () => (
    <FormattedValue
      value={+new Date('2018-08-03T13:56:53.928Z')}
      field={{ id: '', key: [], type: fieldTypes.DATE }}
    />
  ))
  .add('date null', () => (
    <FormattedValue
      value={null}
      field={{ id: '', key: [], type: fieldTypes.DATE }}
    />
  ))
  .add('datetime', () => (
    <FormattedValue
      value={+new Date('2018-08-03T13:56:53.928Z')}
      field={{ id: '', key: [], type: fieldTypes.DATETIME }}
    />
  ))
  .add('datetime null', () => (
    <FormattedValue
      value={null}
      field={{ id: '', key: [], type: fieldTypes.DATETIME }}
    />
  ))
  .add('number', () => (
    <FormattedValue
      value={2}
      field={{ id: '', key: [], type: fieldTypes.NUMBER }}
    />
  ))
  .add('select one boolean', () => (
    <FormattedValue
      value={true}
      field={{ id: '', key: [], type: fieldTypes.SELECT_ONE, options: [] }}
    />
  ))
  .add('select one string', () => (
    <FormattedValue
      value="hello world"
      field={{ id: '', key: [], type: fieldTypes.SELECT_ONE, options: [] }}
    />
  ))
  .add('select multiple', () => (
    <FormattedValue
      value={['foo', true, 2, null]}
      field={{ id: '', key: [], type: fieldTypes.SELECT_MULTIPLE, options: [] }}
    />
  ))
  .add('combinations', () =>
    withPropsCombinations(FormattedValue, {
      value: ['hello world', true, false, null],
      fieldkey: ['testFieldkey'],
      fieldType: [fieldTypes.TEXT]
    })()
  )
