import React from 'react'
import PropTypes from 'prop-types'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'

import FormattedFieldname from '../Shared/FormattedFieldname'

const styles = (theme) => ({
  actions: {
    margin: `${theme.spacing.unit}px ${theme.spacing.unit / 2}px`
  },
  button: {
    margin: `0 ${theme.spacing.unit / 2}px`
  },
  fieldname: {
    maxWidth: 250,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    direction: 'rtl'
  }
})

const HiddenFieldsMenu = ({anchorEl, open, onRequestClose, onShowAll, onHideAll, fields, onToggle, classes}) => (
  <Popover
    id='hidden-fields-menu'
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
    open={open}
    onClose={onRequestClose}
    PaperProps={{
      style: {
        maxHeight: '50vh',
        minWidth: 200,
        maxWidth: '50vw'
      }
    }}
  >
    <div className={classes.actions}>
      <Button dense onClick={onShowAll} className={classes.button}>Show All</Button>
      <Button dense onClick={onHideAll} className={classes.button}>Hide All</Button>
    </div>
    <List dense>
      {fields.map(field => (
        <ListItem key={field.key} button={false}>
          <ListItemText className={classes.fieldname} primary={<FormattedFieldname fieldname={field.key} />} />
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
  classes: PropTypes.object.isRequired,
  anchorEl: PropTypes.node,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onShowAll: PropTypes.func.isRequired,
  onHideAll: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    hidden: PropTypes.bool
  })),
  onToggle: PropTypes.func.isRequired
}

export default withStyles(styles)(HiddenFieldsMenu)
