// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = {
  root: {
    color: 'rgba(0, 0, 0, 0.67)',
    padding: '3px 5px',
    marginRight: 5,
    minHeight: 16,
    textTransform: 'initial',
    '& svg': {
      height: 18,
      width: 18,
      paddingRight: 6
    }
  }
}

type Props = {
  children: React.Node,
  classes: { [className: $Keys<typeof styles>]: string }
}

const ToolbarButton = ({ children, classes, ...otherProps }: Props) => {
  return (
    <Button className={classes.root} {...otherProps}>
      {children}
    </Button>
  )
}

ToolbarButton.muiName = 'Button'

export default withStyles(styles)(ToolbarButton)
