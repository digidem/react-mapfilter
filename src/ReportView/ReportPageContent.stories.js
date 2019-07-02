// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import ReportPaper from './ReportPaper'
import ReportPageContent from './ReportPageContent'
import { getFields } from '../lib/data_analysis'
import exampleFc from '../../fixtures/example_fc.json'

storiesOf('ReportView/components/ReportPageContent', module).add(
  'with data',
  () => {
    const tags = exampleFc.features[0].properties
    const fields = getFields(tags)
    return (
      <ReportPaper paperSize="a4">
        <ReportPageContent
          name="Observation"
          iconLabel="C"
          iconColor="red"
          coords={{ longitude: -51, latitude: 23 }}
          createdAt={new Date()}
          imageSrc="https://s3.amazonaws.com/images.digital-democracy.org/mapfilter-sample/sample-17.jpg"
          fields={fields}
          tags={tags}
          paperSize="a4"
        />
      </ReportPaper>
    )
  }
)
