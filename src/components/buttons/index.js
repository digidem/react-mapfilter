import React from 'react'
import SettingsIcon from 'material-ui/svg-icons/action/settings'
import IconButton from 'material-ui/IconButton'
import PrintIcon from 'material-ui/svg-icons/action/print'

export const SettingsButton = ({openSettings}) => (
  <IconButton tooltip='Settings' onTouchTap={openSettings.bind('general')}>
    <SettingsIcon color='white' />
  </IconButton>
)

export const PrintButton = () => (
  <IconButton tooltip='Print' onTouchTap={() => window.print()}>
    <PrintIcon color='white' />
  </IconButton>
)
