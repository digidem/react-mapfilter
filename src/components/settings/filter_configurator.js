import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {defineMessages, FormattedMessage} from 'react-intl'

import FieldList from './toggleable_fieldlist'
import getFilterableFields from '../../selectors/filterable_fields'
import getFilterFields from '../../selectors/filter_fields'
import { updateVisibleFilters } from '../../action_creators'

const styles = {
  description: {
    padding: '0 16px'
  }
}

const messages = defineMessages({
  description: {
    id: 'filter.filters.description',
    defaultMessage: 'Select the fields you would like to use to filter the data:',
    description: 'Description of what the filter settings pane does'
  }
})

const FilterConfigurator = ({filterableFields, visibleFilters, onUpdateVisibleFilters}) => (
  <div>
    <p style={styles.description}><FormattedMessage {...messages.description} /></p>
    <FieldList fields={filterableFields} visibleFields={visibleFilters} onUpdate={onUpdateVisibleFilters} />
  </div>
)

FilterConfigurator.propTypes = {
  filterableFields: PropTypes.array.isRequired,
  onUpdateVisibleFilters: PropTypes.func.isRequired,
  visibleFilters: PropTypes.array.isRequired
}

function mapStateToProps (state) {
  return {
    filterableFields: getFilterableFields(state),
    visibleFilters: getFilterFields(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateVisibleFilters: filters => dispatch(updateVisibleFilters(filters))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConfigurator)
