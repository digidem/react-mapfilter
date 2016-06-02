const React = require('react')
const FlatButton = require('material-ui/FlatButton').default

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

const ShowAllButton = (props) => (
  <FlatButton
    labelStyle={styles.flatButtonLabel}
    label='Show All'
    primary
    {...props}
    style={Object.assign({}, props.style, styles.flatButton)} />
)

module.exports = ShowAllButton
