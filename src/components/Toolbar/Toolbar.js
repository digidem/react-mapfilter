import PropTypes from 'prop-types'
import React from 'react'
import AppBar from 'material-ui/AppBar'
import { withStyles } from 'material-ui/styles'

const styles = {
  root: {
    zIndex: 10,
    position: 'relative',
    padding: 8,
    flexDirection: 'row'
  }
}

const Toolbar = ({children, classes}) => (
  <AppBar elevation={3} color='default' className={classes.root + ' d-print-none'}>
    {children}
  </AppBar>
)

Toolbar.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Toolbar)
