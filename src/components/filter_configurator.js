import PropTypes from 'prop-types';
import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardHeader } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import { List, ListItem } from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
import {defineMessages, FormattedMessage} from 'react-intl'

import FormattedFieldname from './formatted_fieldname'
import getFilterableFields from '../selectors/filterable_fields'
import getFilterFields from '../selectors/filter_fields'
import { removeFilter, updateVisibleFilters } from '../action_creators'

const styles = {
  card: {
    maxHeight: '100%',
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
  },
  scrollable: {
    overflow: 'auto'
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
    onRemoveFilter: PropTypes.func.isRequired,
    onUpdateVisibleFilters: PropTypes.func.isRequired,
    visibleFilters: PropTypes.array.isRequired
  }

  onToggle = (fieldName) => {
    const { onRemoveFilter, onUpdateVisibleFilters, visibleFilters } = this.props
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

        onRemoveFilter(fieldName)
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
        <CardText style={styles.scrollable}>
          <List>
            {
              filterableFields.map((field) => {
                return (
                  <ListItem
                    key={field}
                    primaryText={<FormattedFieldname fieldname={field} />}
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
    visibleFilters: getFilterFields(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onRemoveFilter: filter => dispatch(removeFilter(filter)),
    onUpdateVisibleFilters: filters => dispatch(updateVisibleFilters(filters))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConfigurator)
