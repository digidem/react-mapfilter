import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import insertCss from 'insert-css'

import ReportView from './ReportView'

insertCss(`
  body {
    margin: 0px;
  }
  .wrapper {
    width: calc(100vw - 60px);
    height: calc(100vh - 60px);
    margin: 20px;
    position: absolute;
    border: 1px dotted red;
  }
  @media only print {
    .wrapper {
      width: auto;
      height; auto;
      position: static;
      margin: 0;
      border: none;
    }
  }
`)

const featuresFixture = [
  {
    type: 'Feature',
    geometry: null,
    properties: {
      string: 'hello',
      number: 1,
      boolean: true,
      array: ['foo', 'bar'],
      nested: {
        foo: 'bar',
        qux: {
          deepNested: 'hello'
        }
      },
      null: null,
      undefined: undefined
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-70, 2]
    },
    properties: {
      string: 'hello',
      number: 1,
      boolean: true,
      array: ['foo', 'bar'],
      nested: {
        foo: 'bar',
        qux: {
          deepNested: 'hello'
        }
      },
      null: null,
      undefined: undefined
    }
  }
]

storiesOf('ReportView', module)
  .addDecorator(story => <div className="wrapper">{story()}</div>)
  .add('Layout test', () => (
    <ReportView
      renderTest
      onClickFeature={action('onClickFeature')}
      features={Array(50)
        .fill(null)
        .map((v, i) => ({ id: i, height: 200 + Math.random() * 200 }))}
    />
  ))
  .add('default', () => <ReportView features={featuresFixture} />)
