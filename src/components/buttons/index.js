import React from 'react'
import IconButton from 'material-ui/IconButton'
import SettingsIcon from 'material-ui-icons/Settings'
import PrintIcon from 'material-ui-icons/Print'

export const SettingsButton = ({openSettings}) => (
  <IconButton onClick={openSettings.bind(null, 'general')}>
    <SettingsIcon color='white' />
  </IconButton>
)

export const PrintButton = () => (
  <IconButton onClick={() => window.print()}>
    <PrintIcon color='white' />
  </IconButton>
)
