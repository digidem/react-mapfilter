// @flow
import React from 'react'
import { storiesOf } from '@storybook/react'

import Image from './Image'

storiesOf('internal/Image', module).add('default', () => (
  <Image
    style={{ width: 600, height: 400, backgroundColor: 'black' }}
    src="http://lorempixel.com/1920/1920/nature/3/"
  />
))
