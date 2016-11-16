const React = require('react')
const FlatButton = require('material-ui/FlatButton').default
const {defineMessages, FormattedMessage} = require('react-intl')

const styles = {
  flatButton: {
    height: 30,
    lineHeight: '29px',
    top: 9
  },
  flatButtonLabel: {
    fontSize: 12,
    top: 0
  }
}

const messages = defineMessages({
  showAll: {
    id: 'filter.show_all',
    defaultMessage: 'Show All',
    description: 'Button text to turn off filters for a field'
  }
})

const ShowAllButton = (props) => (
  <FlatButton
    labelStyle={styles.flatButtonLabel}
    label={<FormattedMessage {...messages.showAll} />}
    primary
    {...props}
    style={Object.assign({}, props.style, styles.flatButton)} />
)

module.exports = ShowAllButton
