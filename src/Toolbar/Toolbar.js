// @flow

import * as React from 'react'
import AppBar from '@material-ui/core/AppBar'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    zIndex: 10,
    position: 'relative',
    padding: 8,
    flexDirection: 'row'
  }
}

type Props = {
  children: React.Node,
  classes: { [className: $Keys<typeof styles>]: string }
}

const Toolbar = ({ children, classes }: Props) => (
  <AppBar
    elevation={3}
    color="default"
    className={classes.root + ' d-print-none'}>
    {children}
  </AppBar>
)

export default withStyles(styles)(Toolbar)
