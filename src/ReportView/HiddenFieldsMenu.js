// @flow

import * as React from 'react'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { defineMessages, FormattedMessage } from 'react-intl'

const msgs = defineMessages({
  // Show all fields in report view
  showAll: 'Show All',
  hideAll: 'Hide All'
})

const styles = theme => ({
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

type Props = {
  classes: { [className: string]: any },
  anchorEl: HTMLElement,
  open: boolean,
  onRequestClose: () => void,
  onShowAll: () => void,
  onHideAll: () => void,
  onToggle: (fieldname: string) => void,
  fields: Array<{
    fieldname: string,
    hidden: boolean
  }>,
  fieldnameTranslations: { [fieldname: string]: string },
  valueTranslations: { [value: string]: string }
}

const HiddenFieldsMenu = ({
  anchorEl,
  open,
  onRequestClose,
  onShowAll,
  onHideAll,
  fields,
  onToggle,
  classes
}: Props) => (
  <Popover
    anchorEl={anchorEl}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    open={open}
    onClose={onRequestClose}
    PaperProps={{
      style: {
        maxHeight: '50vh',
        minWidth: 200,
        maxWidth: '50vw'
      }
    }}>
    <div className={classes.actions}>
      <Button dense onClick={onShowAll} className={classes.button}>
        <FormattedMessage {...msgs.showAll} />
      </Button>
      <Button dense onClick={onHideAll} className={classes.button}>
        <FormattedMessage {...msgs.hideAll} />
      </Button>
    </div>
    <List dense>
      {fields.map(field => (
        <ListItem key={field.fieldname} button={false}>
          <ListItemText
            className={classes.fieldname}
            primary={<FormattedFieldname fieldname={field.fieldname} />}
          />
          <ListItemSecondaryAction>
            <Switch
              onClick={() => onToggle(field.fieldname)}
              checked={!field.hidden}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Popover>
)

export default withStyles(styles)(HiddenFieldsMenu)
