const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React
const Dialog = require('material-ui/Dialog').default
const FlatButton = require('material-ui/FlatButton').default
const { List, ListItem } = require('material-ui/List')
const Toggle = require('material-ui/Toggle').default
const {defineMessages, FormattedMessage} = require('react-intl')

const getCandidateFilters = require('../selectors/candidate_filters')
const { addVisibleFilter, removeVisibleFilter } = require('../action_creators')


const styles = {
  title: {
    margin: '0px',
    padding: '24px 24px 20px',
    color: 'rgba(0, 0, 0, 0.870588)',
    fontSize: '22px',
    lineHeight: '32px',
    fontWeight: '400',
    borderBottom: 'none'
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

    const actions = [
      <FlatButton
        label='Done'
        primary
        onTouchTap={handleClose}
      />
    ]

    return (
      <Dialog
        title={<h3 style={styles.title}><FormattedMessage {...messages.configureFilters} /></h3>}
        actions={actions}
        open
        onRequestClose={this.handleClose}
      >
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
      </Dialog>
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
