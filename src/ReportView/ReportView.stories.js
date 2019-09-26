// @flow
import React from 'react'

import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import ReportView from './ReportView'

const exampleObservations = require('../../fixtures/observations.json')

const imageBaseUrl =
  'https://images.digital-democracy.org/mapfilter-sample/sample-'

const getMedia = ({ id }) => ({
  src: imageBaseUrl + ((parseInt(id, 16) % 17) + 1) + '.jpg',
  type: 'image'
})

export default {
  title: 'ReportView'
}

export const withoutImages = () => (
  <ReportView
    mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    observations={exampleObservations}
    onClick={action('click')}
    getMedia={() => {}}
  />
)

withoutImages.story = {
  name: 'Without Images'
}

export const images = () => (
  <ReportView
    mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    observations={exampleObservations}
    onClick={action('click')}
    getMedia={getMedia}
  />
)

images.story = {
  name: 'Images'
}

export const customFields = () => (
  <ReportView
    mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    observations={exampleObservations}
    onClick={action('click')}
    getMedia={getMedia}
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
)

customFields.story = {
  name: 'Custom fields'
}

export const printView = () => (
  <ReportView
    mapboxAccessToken="pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    observations={exampleObservations.slice(0, 50)}
    onClick={action('click')}
    getMedia={getMedia}
    print
  />
)

printView.story = {
  name: 'Print view'
}
