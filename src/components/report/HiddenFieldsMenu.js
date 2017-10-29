import React from 'react'
import PropTypes from 'prop-types'
import Popover from 'material-ui/Popover'
import List, {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List'
import Switch from 'material-ui/Switch'

import FormattedFieldname from '../shared/formatted_fieldname'

const HiddenFieldsMenu = ({anchorEl, open, onRequestClose, fields, onToggle}) => (
  <Popover
    id='hidden-fields-menu'
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    open={open}
    onRequestClose={onRequestClose}
    PaperProps={{
      style: {
        maxHeight: '50vh',
        minWidth: 200,
        maxWidth: '50vw'
      }
    }}
  >
    <List dense>
      {fields.map(field => (
        <ListItem key={field.key} button={false}>
          <ListItemText primary={<FormattedFieldname fieldname={field.key} />} />
          <ListItemSecondaryAction>
            <Switch
              onClick={() => onToggle(field.key)}
              checked={!field.hidden}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Popover>
)

HiddenFieldsMenu.propTypes = {
  anchorEl: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    hidden: PropTypes.bool
  })),
  onToggle: PropTypes.func.isRequired
}

export default HiddenFieldsMenu
