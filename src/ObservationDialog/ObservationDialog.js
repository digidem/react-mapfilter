// @flow
import React, { useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import TextField from './TextField'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Fade from '@material-ui/core/Fade'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from 'date-fns/locale/en-US'
import frLocale from 'date-fns/locale/fr'
import ptLocale from 'date-fns/locale/pt-BR'
import esLocale from 'date-fns/locale/es'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import DialogActions from '@material-ui/core/DialogActions'
import MuiDialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Typography } from '@material-ui/core'
import { useIntl, FormattedMessage, defineMessages } from 'react-intl'
import clone from 'clone-deep'

import FeatureHeader from '../internal/FeatureHeader'
import MediaCarousel from './MediaCarousel'
import { defaultGetPreset } from '../utils/helpers'
import { get, set } from '../utils/get_set'
import Field from './Field'
import type { Observation } from 'mapeo-schema'
import type { PresetWithFields, GetMedia, Attachment, Key } from '../types'

const m = defineMessages({
  confirmTitle: 'Close without saving changes?',
  confirmDescription:
    'You have made some changes, closing without saving will loose the changes you make',
  confirmButtonConfirm: 'Discard changes',
  confirmButtonCancel: 'Cancel',
  // Header for section that includes the additional details for an observation
  detailsHeader: 'Details',
  // Header for section with additional fields that are not defined in the preset
  additionalHeader: 'Additional data',
  // Cancel button once observation has been edited
  cancelEditButton: 'Cancel',
  // Save edit button
  saveEditButton: 'Save'
})

type ImageMediaItem = {
  src: string,
  type: 'image'
}

type Props = {
  open?: boolean,
  onRequestClose: () => void,
  observation: Observation,
  onSave: (observation: Observation) => void,
  getPreset?: Observation => PresetWithFields | void,
  /**
   * For a given attachment, return `src` and `type`
   */
  getMedia: GetMedia
}

const localeMap = {
  en: enLocale,
  fr: frLocale,
  pt: ptLocale,
  es: esLocale
}

function getLocaleData(locale) {
  if (!locale) return localeMap.en
  return localeMap[locale] || localeMap[locale.split('-')[0]] || localeMap.en
}

function defaultGetMedia({ type, id }: Attachment) {
  if (type && type.split('/')[0] !== 'image') return
  return {
    type: 'image',
    src: id
  }
}

const ConfirmDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog
      disableBackdropClick
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        <FormattedMessage {...m.confirmTitle} />
      </DialogTitle>
      <MuiDialogContent>
        <DialogContentText id="alert-dialog-description">
          <FormattedMessage {...m.confirmDescription} />
        </DialogContentText>
      </MuiDialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          <FormattedMessage {...m.confirmButtonCancel} />
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          <FormattedMessage {...m.confirmButtonConfirm} />
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles({
  root: {
    '&$expanded': {
      minHeight: 48
    }
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary)

const ExpansionPanelDetails = withStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 21px 10px 21px',
    '& > div:first-child': {
      marginTop: 10
    }
  }
})(MuiExpansionPanelDetails)

const DialogContent = ({
  open = false,
  onRequestClose,
  onSave,
  observation,
  getPreset = defaultGetPreset,
  getMedia = defaultGetMedia
}: {
  ...$Exact<Props>,
  onRequestClose: (shouldConfirm: boolean) => void
}) => {
  const cx = useStyles()
  const [values, setValues] = useState(
    observation.tags ? clone(observation.tags) : {}
  )
  const [dirty, setDirty] = useState(false)
  const { locale } = useIntl()

  const handleSave = () => {
    onSave(set(observation, 'tags', values))
    onRequestClose(false)
  }

  const handleRequestClose = () => {
    // Ask for confirmation if form is dirty
    onRequestClose(dirty)
  }

  const handleChange = (key: Key, newValue: any) => {
    setDirty(true)
    setValues(set(values, key, newValue))
  }

  const preset = getPreset(observation) || {}
  const coords =
    observation.lat != null && observation.lon != null
      ? {
          latitude: observation.lat,
          longitude: observation.lon
        }
      : undefined

  const descriptionKey = values.note ? 'note' : 'notes'

  const mediaItems: ImageMediaItem[] = (observation.attachments || []).reduce(
    (acc, cur) => {
      const item = getMedia(cur, { width: 800, height: 600 })
      // $FlowFixMe - need to fix type refinement here
      if (item && item.type === 'image') acc.push(item)
      return acc
    },
    []
  )

  return (
    <MuiPickersUtilsProvider
      utils={DateFnsUtils}
      locale={getLocaleData(locale)}>
      <IconButton
        className={cx.closeButton}
        color="inherit"
        onClick={handleRequestClose}
        aria-label="Close">
        <CloseIcon />
      </IconButton>
      {mediaItems.length > 0 && (
        <div className={cx.mediaWrapper}>
          <MediaCarousel items={mediaItems} className={cx.media} />
        </div>
      )}
      <FeatureHeader
        icon={preset.icon}
        name={preset.name}
        coords={coords}
        createdAt={new Date(observation.created_at)}
      />
      <TextField
        value={values[descriptionKey]}
        onChange={newValue => handleChange(descriptionKey, newValue)}
        multiline
        margin="dense"
        label="Description"
        className={cx.descriptionField}
      />
      {preset.fields.length > 0 && (
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography component="h2" className={cx.sectionHeading}>
              <FormattedMessage {...m.detailsHeader} />
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {preset.fields.map(field => (
              <Field
                key={field.id}
                field={field}
                value={get(values, field.key)}
                onChange={handleChange}
              />
            ))}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )}
      {Array.isArray(preset.additionalFields) &&
        preset.additionalFields.length > 0 && (
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography component="h2" className={cx.sectionHeading}>
                <FormattedMessage {...m.additionalHeader} />
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {preset.additionalFields.map(field => (
                <Field
                  key={field.id}
                  field={field}
                  value={get(values, field.key)}
                  onChange={handleChange}
                />
              ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
      <Fade in={dirty}>
        <Collapse in={dirty} className={cx.actions}>
          <Button
            color="default"
            variant="contained"
            className={cx.button}
            onClick={handleRequestClose}>
            <FormattedMessage {...m.cancelEditButton} />
          </Button>
          <Button
            color="primary"
            variant="contained"
            className={cx.button}
            onClick={handleSave}>
            <FormattedMessage {...m.saveEditButton} />
          </Button>
        </Collapse>
      </Fade>
    </MuiPickersUtilsProvider>
  )
}

const ObservationDialog = ({ open, onRequestClose, ...otherProps }: Props) => {
  const [confirm, setConfirm] = useState(null)

  const handleRequestClose = shouldConfirm => {
    if (!shouldConfirm) {
      setConfirm(null)
      onRequestClose()
      return
    }
    setConfirm(state => didConfirm => {
      setConfirm(null)
      if (didConfirm) onRequestClose()
    })
  }
  return (
    <>
      <Dialog
        disableBackdropClick
        open={open}
        onClose={handleRequestClose}
        scroll="body"
        fullWidth
        maxWidth="sm">
        {open && (
          <DialogContent {...otherProps} onRequestClose={handleRequestClose} />
        )}
      </Dialog>
      <ConfirmDialog
        open={!!confirm}
        onConfirm={() => confirm && confirm(true)}
        onCancel={() => confirm && confirm(false)}
      />
    </>
  )
}

export default ObservationDialog

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    zIndex: 999,
    left: 0,
    top: 0,
    color: 'white'
  },
  descriptionField: {
    boxSizing: 'border-box',
    margin: '0 10px 13.5px 10px',
    width: 'calc(100% - 20px)',
    '& .MuiInputBase-inputMultiline': theme.typography.body1,
    '& .MuiInputLabel-root': {
      opacity: 0,
      transition: 'opacity 200ms cubic-bezier(0.0, 0, 0.2, 1)'
    },
    '&:hover .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused': {
      opacity: 1
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0,0,0,0)'
    }
  },
  sectionHeading: {
    fontWeight: 500
  },
  mediaWrapper: {
    width: '100%',
    paddingTop: '75%',
    position: 'relative',
    height: 0
  },
  media: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  details: {
    flex: 1,
    minWidth: 320,
    flexBasis: '33%',
    backgroundColor: 'white',
    overflowY: 'scroll'
  },
  actions: {
    margin: '0 10px',
    textAlign: 'right'
  },
  button: {
    marginLeft: theme.spacing(1),
    marginTop: 14,
    marginBottom: 14
  }
}))
