import React from 'react'

import { storiesOf } from '@storybook/react'

import Select from '../src/components/shared/Select'
import MultiSelect from '../src/components/shared/MultiSelect'

const PROVINCES = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon'
]

class ControlledSelect extends React.Component {
  state = {
    value: 'Alberta'
  }

  handleChange = (e, b) => {
    this.setState({value: b.newValue})
  }

  render () {
    return <Select
      onChange={this.handleChange}
      value={this.state.value}
      {...this.props}
    />
  }
}

class ControlledMultiSelect extends React.Component {
  state = {
    value: ['Alberta']
  }

  handleChange = (e, b) => {
    this.setState({value: b.newValue})
  }

  render () {
    return <MultiSelect
      onChange={this.handleChange}
      value={this.state.value}
      {...this.props}
    />
  }
}

storiesOf('Select', module)
  .add('with options', () => (
    <ControlledSelect
      suggestions={PROVINCES}
    />
  ))

storiesOf('MultiSelect', module)
  .add('with options', () => (
    <ControlledMultiSelect
      suggestions={PROVINCES}
    />
  ))
