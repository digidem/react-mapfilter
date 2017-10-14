import React from 'react'
import assign from 'object-assign'
import Typography from 'material-ui/Typography'

const styles = {
  alert: {
    color: '#c09853',
    padding: '8px 35px 8px 14px',
    textShadow: '0 1px 0 rgba(255, 255, 255, 0.5)',
    backgroundColor: '#fcf8e3'
  }
}

export default ({label, style, className}) => (
  <Typography style={assign({}, styles.alert, style)} className={className}>
    <strong>Warning! </strong>
    {label}
  </Typography>
)
