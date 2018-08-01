import { configure, addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import docs from 'storybook-addon-docgen'

addDecorator((story, context) =>
  withInfo({
    header: false,
    inline: true
  })(story)(context)
)

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
