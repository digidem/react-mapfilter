const React = require('react')
const { connect } = require('react-redux')
const { PropTypes } = React
const { Card, CardText, CardHeader } = require('material-ui/Card')
const IconButton = require('material-ui/IconButton').default
const CloseIcon = require('material-ui/svg-icons/navigation/close').default
const { List, ListItem } = require('material-ui/List')
const Toggle = require('material-ui/Toggle').default
const {defineMessages, FormattedMessage} = require('react-intl')

const getFilterableFields = require('../selectors/filterable_fields')
const getVisibleFilters = require('../selectors/visible_filters')
const { updateVisibleFilters } = require('../action_creators')
const msg = require('../util/intl_helpers').createMessage

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
    filterableFields: PropTypes.array.isRequired,
    onCloseClick: PropTypes.func.isRequired,
    onUpdateVisibleFilters: PropTypes.func.isRequired,
    visibleFilters: PropTypes.array.isRequired
  }

  onToggle = (fieldName) => {
    const { onUpdateVisibleFilters, visibleFilters } = this.props
    return ({target}) => {
      let newVisibleFilters

      if (target.checked) {
        newVisibleFilters = [
          ...visibleFilters,
          fieldName
        ]
      } else {
        const index = visibleFilters.indexOf(fieldName)
        newVisibleFilters = [
          ...visibleFilters.slice(0, index),
          ...visibleFilters.slice(index + 1)
        ]
      }

      onUpdateVisibleFilters(newVisibleFilters)
    }
  }

  render () {
    const { filterableFields, onCloseClick, visibleFilters } = this.props

    return (
      <Card
        style={styles.card}
        containerStyle={styles.cardContainerStyle}
        zDepth={2}>
        <CardHeader
          style={styles.header}
          title={<h3 style={styles.title}><FormattedMessage {...messages.configureFilters} /></h3>}>
          <IconButton style={styles.icon} onTouchTap={onCloseClick}>
            <CloseIcon />
          </IconButton>
        </CardHeader>
        <CardText>
          <List>
            {
              filterableFields.map((field) => {
                return (
                  <ListItem
                    key={field}
                    primaryText={<FormattedMessage {...msg('field_key')(field)} />}
                    rightToggle={
                      <Toggle
                        toggled={visibleFilters.includes(field)}
                        onToggle={this.onToggle(field)}
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
    filterableFields: getFilterableFields(state),
    visibleFilters: getVisibleFilters(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateVisibleFilters: filters => dispatch(updateVisibleFilters(filters))
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConfigurator)
