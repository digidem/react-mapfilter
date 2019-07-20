// @flow
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import ReportView from './ReportView'

const exampleObservations = require('../../fixtures/observations.json')

const imageBaseUrl =
  'https://images.digital-democracy.org/mapfilter-sample/sample-'

storiesOf('ReportView', module)
  // .addDecorator(story => <div className="wrapper">{story()}</div>)
  .add('Without Images', () => (
    <ReportView
      mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      observations={exampleObservations}
      onClick={action('click')}
      getMediaUrl={() => {}}
    />
  ))
  .add('Images', () => (
    <ReportView
      mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      observations={exampleObservations}
      onClick={action('click')}
      getMediaUrl={({ id }, { width = 200, height = 200 } = {}) =>
        imageBaseUrl + ((parseInt(id, 16) % 17) + 1) + '.jpg'
      }
    />
  ))
  .add('Custom fields', () => (
    <ReportView
      mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      observations={exampleObservations}
      onClick={action('click')}
      getMediaUrl={({ id }, { width = 200, height = 200 } = {}) =>
        imageBaseUrl + ((parseInt(id, 16) % 17) + 1) + '.jpg'
      }
      getFields={obs => [
        {
          id: 'myField',
          key: 'caption',
          label: 'Image caption',
          type: 'text',
          appearance: 'multiline'
        }
      ]}
    />
  ))
  .add('Print view', () => (
    <ReportView
      mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
      observations={exampleObservations.slice(0, 50)}
      onClick={action('click')}
      getMediaUrl={({ id }, { width = 200, height = 200 } = {}) =>
        imageBaseUrl + ((parseInt(id, 16) % 17) + 1) + '.jpg'
      }
      print
    />
  ))
