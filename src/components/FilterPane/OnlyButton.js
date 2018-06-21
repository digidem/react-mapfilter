import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

import {defineMessages, FormattedMessage} from 'react-intl'

const styles = {
  flatButton: {
    minHeight: 28,
    height: 28,
    minWidth: 'auto',
    padding: '6px 16px',
    fontSize: 12,
    marginLeft: -12
  }
}

const messages = defineMessages({
  only: {
    id: 'filter.show_only',
    defaultMessage: 'Only',
    description: 'Button text to only show a particular field value in a filter'
  }
})

const OnlyButton = ({classes, onClick}) => (
  <Button
    color='primary'
    className={classes.flatButton}
    onClick={onClick}>
    <FormattedMessage {...messages.only} />
  </Button>
)

export default withStyles(styles)(OnlyButton)
