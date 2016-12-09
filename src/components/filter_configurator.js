const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React
const { Card, CardText, CardHeader } = require('material-ui/Card')
const IconButton = require('material-ui/IconButton').default
const CloseIcon = require('material-ui/svg-icons/navigation/close').default
const { List, ListItem } = require('material-ui/List')
const Toggle = require('material-ui/Toggle').default
const {defineMessages, FormattedMessage} = require('react-intl')

const getCandidateFilters = require('../selectors/candidate_filters')
const { addVisibleFilter, removeVisibleFilter } = require('../action_creators')


const styles = {
  card: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  icon: {
    float: 'right'
  }
}

const messages = defineMessages({
  configureFilters: {
    id: 'filter.configure',
    defaultMessage: 'Configure Filters',
    description: 'Dialog title text when displaying available filters'
  }
})

class FilterConfigurator extends React.Component {
  static propTypes = {
    candidateFilters: PropTypes.array.isRequired,
    handleClose: PropTypes.func.isRequired,
    onAddVisibleFilter: PropTypes.func.isRequired,
    onRemoveVisibleFilter: PropTypes.func.isRequired,
    visibleFilters: PropTypes.array.isRequired
  }

  onToggle = (fieldName) => {
    const { onAddVisibleFilter, onRemoveVisibleFilter } = this.props
    return ({target}) => {
      if (target.checked) {
        onAddVisibleFilter(fieldName)
      } else {
        onRemoveVisibleFilter(fieldName)
      }
    }
  }

  render () {
    const { candidateFilters, handleClose, visibleFilters } = this.props

    return (
      <Card
        style={styles.card}
        containerStyle={styles.cardContainerStyle}
        zDepth={2}>
        <CardHeader
          style={styles.header}
          title={<h3 style={styles.title}><FormattedMessage {...messages.configureFilters} /></h3>}>
          <IconButton style={styles.icon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </CardHeader>
        <CardText>
          <List>
            {
              // TODO allow these to be reordered
              candidateFilters.map(([k, v]) => {
                return (
                  <ListItem
                    key={k}
                    primaryText={k}
                    rightToggle={
                      <Toggle
                        toggled={visibleFilters.includes(k)}
                        onToggle={this.onToggle(k)}
                      />}
                  />
                )
              })
            }
          </List>
        </CardText>
      </Card>
    )
  }
}

function mapStateToProps (state) {
  return {
    candidateFilters: getCandidateFilters(state),
    visibleFilters: state.visibleFilters
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onAddVisibleFilter: name => dispatch(addVisibleFilter(name)),
    onRemoveVisibleFilter: name => dispatch(removeVisibleFilter(name))
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConfigurator)
