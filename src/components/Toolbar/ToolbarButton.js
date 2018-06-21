import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import omit from 'lodash/omit'

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

const ToolbarButton = (props) => {
  const {children, classes} = props
  const otherProps = omit(props, 'children', 'classes')
  return <Button className={classes.root} {...otherProps}>
    {children}
  </Button>
}

ToolbarButton.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired
}

ToolbarButton.muiName = 'Button'

export default withStyles(styles)(ToolbarButton)
