const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React
const Dialog = require('material-ui/Dialog').default
const FlatButton = require('material-ui/FlatButton').default
const { List, ListItem } = require('material-ui/List')
const Toggle = require('material-ui/Toggle').default
const {defineMessages, injectIntl, intlShape} = require('react-intl')

const getCandidateFilters = require('../selectors/candidate_filters')
const { addVisibleFilter, removeVisibleFilter } = require('../action_creators')


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
    intl: intlShape.isRequired,
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
    const { candidateFilters, handleClose, intl, visibleFilters } = this.props

    const actions = [
      <FlatButton
        label='Done'
        primary
        onTouchTap={handleClose}
      />
    ]

    // FormattedMessage
    return (
      <Dialog
        title={intl.formatMessage(messages.configureFilters)}
        actions={actions}
        modal={false}
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
)(injectIntl(FilterConfigurator))
