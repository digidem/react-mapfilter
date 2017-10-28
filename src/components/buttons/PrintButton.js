import React from 'react'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import PrintIcon from 'material-ui-icons/Print'
import { injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  print: {
    id: 'buttons.print',
    defaultMessage: 'Print'
  }
})

const PrintButton = ({intl}) => {
  const name = intl.formatMessage(messages.print)
  return <Tooltip title={name}>
    <IconButton onClick={() => window.print()} aria-label={name}>
      <PrintIcon color='white' />
    </IconButton>
  </Tooltip>
}

export default injectIntl(PrintButton)
