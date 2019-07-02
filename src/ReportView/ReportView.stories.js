// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import ReportView from './ReportView'

const exampleObservations = require('../../fixtures/observations.json')

const imageBaseUrl =
  'https://images.digital-democracy.org/mapfilter-sample/sample-'

storiesOf('ReportView', module)
  // .addDecorator(story => <div className="wrapper">{story()}</div>)
  .add('Without Images', () => (
    <ReportView observations={exampleObservations} />
  ))
  .add('Images', () => (
    <ReportView
      observations={exampleObservations}
      getImageSrc={obs =>
        imageBaseUrl + ((obs.id.charCodeAt(0) % 17) + 1) + '.jpg'
      }
    />
  ))
  .add('Custom fields', () => (
    <ReportView
      observations={exampleObservations}
      getImageSrc={obs =>
        imageBaseUrl + ((obs.id.charCodeAt(0) % 17) + 1) + '.jpg'
      }
      getFields={obs => [
        {
          id: 'myField',
          key: 'caption',
          label: 'Image caption',
          type: 'text',
          appearance: 'multiline',
          get: tags => tags.caption,
          set: (tags, value) => (tags.caption = value)
        }
      ]}
    />
  ))
  .add('Print view', () => (
    <ReportView
      observations={exampleObservations.slice(0, 50)}
      getImageSrc={obs =>
        imageBaseUrl + ((obs.id.charCodeAt(0) % 17) + 1) + '.jpg'
      }
      print
    />
  ))
