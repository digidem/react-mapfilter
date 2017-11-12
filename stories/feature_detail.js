import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import FeatureDetail from '../src/components/feature_detail'

const feature = require('./fixtures/feature.json')
const fieldAnalysis = require('./fixtures/field_analysis')

const media = [{
  'fieldname': 'picture.url',
  'value': 'https://s3.amazonaws.com/images.digital-democracy.org/mapfilter-sample/sample-14.jpg'
}, {
  'fieldname': 'picture2',
  'value': 'https://s3.amazonaws.com/images.digital-democracy.org/mapfilter-sample/sample-14.jpg'
}, {
  'fieldname': 'picture3',
  'value': 'https://s3.amazonaws.com/images.digital-democracy.org/mapfilter-sample/sample-14.jpg'
}]

const store = createStore(state => state, {})

storiesOf('FeatureDetail', module)
  .add('Default', () => (
    <Provider store={store}>
      <div style={{maxWidth: 600, margin: 'auto'}}>
        <FeatureDetail
          onRequestClose={action('requestClose')}
          onDeleteFeature={action('deleteFeature')}
          onEditFeature={action('editFeature')}
          feature={feature}
          fieldAnalysis={fieldAnalysis}
          media={media}
           />
      </div>
    </Provider>
  ))
