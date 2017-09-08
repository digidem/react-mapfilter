import React from 'react'
import Button from 'material-ui/Button'
import {defineMessages, FormattedMessage} from 'react-intl'

const styles = {
  flatButton: {
    height: 30,
    lineHeight: '29px',
    position: 'absolute',
    right: 0,
    top: -4,
    zIndex: 3,
    backgroundColor: 'rgba(235, 235, 235, 0.9)'
  },
  flatButtonLabel: {
    fontSize: 12,
    top: 0
  }
}

const messages = defineMessages({
  only: {
    id: 'filter.show_only',
    defaultMessage: 'Only',
    description: 'Button text to only show a particular field value in a filter'
  }
})

const OnlyButton = (props) => (
  <Button
    labelStyle={styles.flatButtonLabel}
    label={<FormattedMessage {...messages.only} />}
    color='primary'
    style={styles.flatButton}
    {...props} />
)

export default OnlyButton
