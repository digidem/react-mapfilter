import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import HiddenFieldsMenu from '../src/components/ReportView/HiddenFieldsMenu'

const fields = [{
  key: 'None',
  hidden: false
}, {
  key: 'Atria',
  hidden: false
}, {
  key: 'with_underscore',
  hidden: false
}, {
  key: 'Dione',
  hidden: false
}, {
  key: 'lower',
  hidden: false
}, {
  key: 'Luna',
  hidden: true
}, {
  key: 'Oberon',
  hidden: true
}, {
  key: 'Phobos',
  hidden: false
}, {
  key: 'Umbriel',
  hidden: false
}]

class HiddenFieldsMenuWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {fields: fields}
  }
  render () {
    return <HiddenFieldsMenu
      open
      fields={fields}
      onToggle={key => {
        const field = fields.find(f => f.key === key)
        if (field) field.hidden = !field.hidden
        this.setState({fields: fields.slice()})
      }}
      onRequestClose={action('close')} />
  }
}

storiesOf('Hidden Fields', module)
  .add('Default', () => (
    <HiddenFieldsMenuWrapper />
  ))
