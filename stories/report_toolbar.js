import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ReportToolbar from '../src/components/report/ReportToolbar'

const fieldAnalysis = {
  properties: {
    name: {},
    happening: {},
    date: {},
    where: {}
  }
}

class ReportToolbarWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hiddenFields: {
        name: true,
        happening: true
      }
    }
  }

  render () {
    const {hiddenFields} = this.state
    return <ReportToolbar
      fieldAnalysis={fieldAnalysis}
      hiddenFields={hiddenFields}
      onToggleFieldVisibility={fieldname => {
        this.setState({
          hiddenFields: Object.assign({},
            hiddenFields,
            {[fieldname]: !hiddenFields[fieldname]}
          )
        })
      }} />
  }
}

storiesOf('ReportToolbar', module)
  .add('Default', () => (
    <ReportToolbarWrapper />
  ))
