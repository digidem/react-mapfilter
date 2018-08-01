// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'
import withPropsCombinations from 'react-storybook-addon-props-combinations'

// import { action } from '@storybook/addon-actions'

import FormattedValue from './FormattedValue'
import FieldTranslationProvider from '../FieldTranslationProvider'
import { UNDEFINED } from '../constants/field_values'

storiesOf('internal/FormattedValue', module).add(
  'plain text',
  withPropsCombinations(FormattedValue, {
    value: [
      'hello world',
      true,
      false,
      0,
      42,
      [1, 2],
      undefined,
      UNDEFINED,
      null
    ]
  })
)
