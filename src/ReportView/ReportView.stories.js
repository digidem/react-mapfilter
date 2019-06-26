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
  .add('Minimal', () => <ReportView observations={exampleObservations} />)
  .add('Images', () => (
    <ReportView
      observations={exampleObservations}
      getImageSrc={obs =>
        imageBaseUrl + ((obs.id.charCodeAt(0) % 17) + 1) + '.jpg'
      }
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
