const React = require('react')
const FlatButton = require('material-ui/FlatButton').default

const styles = {
  flatButton: {
    height: 30,
    lineHeight: '29px',
    position: 'absolute',
    right: 0,
    top: -4,
    zIndex: 3
  },
  flatButtonLabel: {
    fontSize: 12,
    top: 0
  }
}

const OnlyButton = (props) => (
  <FlatButton
    labelStyle={styles.flatButtonLabel}
    label='Only'
    primary
    style={styles.flatButton}
    {...props} />
)

module.exports = OnlyButton
