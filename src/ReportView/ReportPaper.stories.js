// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'

import ReportPaper from './ReportPaper'

storiesOf('ReportView/components/ReportPaper', module)
  .add('empty', () => (
    <ReportPaper paperSize="a4">
      <h1>Hello World</h1>
    </ReportPaper>
  ))
  .add('clickable', () => (
    <ReportPaper paperSize="a4" onClick={action('page click')}>
      <h1>Hello World</h1>
    </ReportPaper>
  ))
