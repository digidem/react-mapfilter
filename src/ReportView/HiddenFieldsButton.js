// @flow
import React from 'react'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { defineMessages, FormattedMessage } from 'react-intl'

import ToolbarButton from '../internal/ToolbarButton'
import FormattedFieldname from '../internal/FormattedFieldname'

const msgs = defineMessages({
  // Button label for hide fields menu
  hideFieldsLabel: `{count, plural,
    =0 {Hide Fields}
    one {# Hidden Field}
    other {# Hidden Fields}
  }`,
  // Show all fields in report view
  showAll: 'Show All',
  // Hide all fields in report view
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
  fieldState: { [fieldkey: string]: boolean },
  showAllFields: () => void,
  hideAllFields: () => void,
  toggleFieldVisibility: (fieldkey: string) => void,
  classes: { [className: string]: string }
}

type State = {
  dialogOpen: boolean,
  buttonEl?: HTMLElement
}

class HiddenFieldsButton extends React.Component<Props, State> {
  state = {
    dialogOpen: false,
    buttonEl: undefined
  }

  toggleMenu = (event: SyntheticInputEvent<HTMLButtonElement>) => {
    this.setState({
      dialogOpen: !this.state.dialogOpen,
      buttonEl: event.currentTarget
    })
  }

  render() {
    const {
      classes,
      fieldState,
      toggleFieldVisibility,
      showAllFields,
      hideAllFields
    } = this.props
    const { dialogOpen, buttonEl } = this.state
    const fieldkeys = Object.keys(fieldState)
    const hiddenCount = fieldkeys.filter(key => fieldState[key]).length
    return (
      <React.Fragment>
        <ToolbarButton onClick={this.toggleMenu}>
          <VisibilityOffIcon />
          <FormattedMessage
            {...msgs.hideFieldsLabel}
            values={{ count: hiddenCount }}
          />
        </ToolbarButton>
        <Popover
          anchorEl={buttonEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={dialogOpen}
          onClose={this.toggleMenu}
          PaperProps={{
            style: {
              maxHeight: '50vh',
              minWidth: 200,
              maxWidth: '50vw'
            }
          }}>
          <div className={classes.actions}>
            <Button dense onClick={showAllFields} className={classes.button}>
              <FormattedMessage {...msgs.showAll} />
            </Button>
            <Button dense onClick={hideAllFields} className={classes.button}>
              <FormattedMessage {...msgs.hideAll} />
            </Button>
          </div>
          <List dense>
            {fieldkeys.map(fieldkey => (
              <ListItem key={fieldkey} button={false}>
                <ListItemText
                  className={classes.fieldname}
                  primary={<FormattedFieldname fieldkey={fieldkey} />}
                />
                <ListItemSecondaryAction>
                  <Switch
                    onClick={() => toggleFieldVisibility(fieldkey)}
                    checked={!fieldState[fieldkey]}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Popover>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(HiddenFieldsButton)
