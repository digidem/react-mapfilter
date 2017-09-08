import PropTypes from 'prop-types'
import React from 'react'
import List, { ListItem } from 'material-ui/List'
import Switch from 'material-ui/Switch'

import FormattedFieldname from '../shared/formatted_fieldname'

class FieldList extends React.Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    onUpdate: PropTypes.func.isRequired,
    visibleFields: PropTypes.array.isRequired
  }

  handleToggle (value, e) {
    const {fields, visibleFields} = this.props
    // Keep order of fields in visibleFields
    const newVisibleFields = fields.filter(field => {
      return (e.target.checked && (field === value || visibleFields.indexOf(field) > -1)) ||
        (!e.target.checked && (field !== value && visibleFields.indexOf(field) > -1))
    })
    this.props.onUpdate(newVisibleFields)
  }

  render () {
    const { fields, visibleFields } = this.props

    return (
      <List>
        {fields.map(field => (
          <ListItem
            key={field}
            style={!visibleFields.includes(field) && {opacity: 0.4}}
            primaryText={<FormattedFieldname fieldname={field} />}
            rightToggle={
              <Switch
                checked={visibleFields.includes(field)}
                onChange={this.handleToggle.bind(this, field)}
              />}
          />
        ))}
      </List>
    )
  }
}

export default FieldList
