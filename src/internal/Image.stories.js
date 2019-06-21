// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import Image from './Image'
import { ResizerContext } from './Context'

storiesOf('internal/Image', module)
  .add('2000px image', () => (
    <Image
      style={{ width: 600, height: 400, backgroundColor: 'black' }}
      src="http://lorempixel.com/1920/1920/nature/3/"
    />
  ))
  .add('resizer', () => (
    <ResizerContext.Provider
      value={(url, size) => url.replace(/\{size\}/g, size + '')}>
      <Image
        style={{ width: 600, height: 400, backgroundColor: 'black' }}
        src={`http://lorempixel.com/{size}/{size}/nature/5/?d=${Date.now()}`}
      />
    </ResizerContext.Provider>
  ))
