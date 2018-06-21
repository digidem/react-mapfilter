import React from 'react'
import Button from '@material-ui/core/Button'
import {defineMessages, FormattedMessage} from 'react-intl'

const messages = defineMessages({
  showAll: {
    id: 'filter.show_all',
    defaultMessage: 'Show All',
    description: 'Button text to turn off filters for a field'
  }
})

const ShowAllButton = (props) => (
  <Button color='primary' {...props}>
    <FormattedMessage {...messages.showAll} />
  </Button>
)

export default ShowAllButton
