import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import PrintDialog from '../src/components/PrintDialog'

class PrintDialogWrapper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      paperSize: 'letter'
    }
  }

  render () {
    return <PrintDialog
      open
      onRequestClose={action('close')}
      paperSize={this.state.paperSize}
      onChangePaperSize={paperSize => this.setState({paperSize})} />
  }
}

storiesOf('PrintDialog', module)
  .add('Default', () => (
    <PrintDialogWrapper />
  ))
