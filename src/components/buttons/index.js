import React from 'react'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui-icons/Settings'
import Tooltip from 'material-ui/Tooltip'
import PrintIcon from 'material-ui-icons/Print'
import { injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  settings: {
    id: 'buttons.settings',
    defaultMessage: 'Settings'
  },
  print: {
    id: 'buttons.print',
    defaultMessage: 'Print'
  }
})

const SettingsButton = injectIntl(({openSettings, intl}) => {
  const name = intl.formatMessage(messages.settings)
  return <Tooltip title={name}>
    <IconButton onClick={openSettings.bind(null, 'general')} aria-label={name}>
      <SettingsIcon color='white' />
    </IconButton>
  </Tooltip>
})

const PrintButton = injectIntl(({intl}) => {
  const name = intl.formatMessage(messages.print)
  return <Tooltip title={name}>
    <IconButton onClick={() => window.print()} aria-label={name}>
      <PrintIcon color='white' />
    </IconButton>
  </Tooltip>
})

export { SettingsButton, PrintButton }
