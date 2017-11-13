import PropTypes from 'prop-types'
import React from 'react'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Switch from 'material-ui/Switch'

import FormattedFieldname from '../shared/FormattedFieldname'

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
      <List dense>
        {fields.map(field => (
          <ListItem
            key={field}
            style={!visibleFields.includes(field) ? {opacity: 0.4} : {}}>
            <ListItemText primary={<FormattedFieldname fieldname={field} />} />
            <ListItemSecondaryAction>
              <Switch
                checked={visibleFields.includes(field)}
                onChange={this.handleToggle.bind(this, field)}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    )
  }
}

export default FieldList
