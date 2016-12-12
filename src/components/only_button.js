const React = require('react')
const FlatButton = require('material-ui/FlatButton').default
const {defineMessages, FormattedMessage} = require('react-intl')

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
  <FlatButton
    labelStyle={styles.flatButtonLabel}
    label={<FormattedMessage {...messages.only} />}
    primary
    style={styles.flatButton}
    {...props} />
)

module.exports = OnlyButton
