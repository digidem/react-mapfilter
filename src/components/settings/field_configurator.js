import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {defineMessages, FormattedMessage} from 'react-intl'

import FieldList from './toggleable_fieldlist'
import getFieldAnalysis from '../../selectors/field_analysis'
import getVisibleFields from '../../selectors/visible_fields'
import { updateVisibleFields } from '../../action_creators'

const styles = {
  description: {
    padding: '0 16px'
  }
}

const messages = defineMessages({
  description: {
    id: 'filter.fields.description',
    defaultMessage: 'Show or hide fields in reports and the detail view:',
    description: 'Description of what the fields setting pane does'
  }
})

const FilterConfigurator = ({fields, visibleFields, onUpdateVisibleFields}) => (
  <div>
    <p style={styles.description}><FormattedMessage {...messages.description} /></p>
    <FieldList fields={fields} visibleFields={visibleFields} onUpdate={onUpdateVisibleFields} />
  </div>
)

FilterConfigurator.propTypes = {
  fields: PropTypes.array.isRequired,
  onUpdateVisibleFields: PropTypes.func.isRequired,
  visibleFields: PropTypes.array.isRequired
}

function mapStateToProps (state) {
  return {
    fields: Object.keys(getFieldAnalysis(state).properties),
    visibleFields: getVisibleFields(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onUpdateVisibleFields: fields => dispatch(updateVisibleFields(fields))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterConfigurator)
