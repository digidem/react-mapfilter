// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import { action } from '@storybook/addon-actions'

import ReportPaper from './ReportPaper'
import FeatureHeader from '../internal/FeatureHeader'
import Image from '../internal/Image'
import DetailsTable from '../internal/DetailsTable'
import { getFields } from '../lib/data_analysis'
import exampleFc from '../../fixtures/example_fc.json'

storiesOf('ReportView/ReportPaper', module)
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
  .add('with data', () => {
    const tags = exampleFc.features[0].properties
    const fields = getFields(tags)
    return (
      <ReportPaper paperSize="a4">
        <FeatureHeader
          name="Observation"
          iconLabel="C"
          iconColor="red"
          coords={{ longitude: -51, latitude: 23 }}
          createdAt={new Date()}
        />
        <Image
          style={{
            width: '100%',
            height: '12cm',
            borderTop: '1px solid rgb(224, 224, 224)',
            borderBottom: '1px solid rgb(224, 224, 224)'
          }}
          src="https://lorempixel.com/640/480/nature/1"
        />
        <DetailsTable fields={fields} tags={tags} />
      </ReportPaper>
    )
  })
