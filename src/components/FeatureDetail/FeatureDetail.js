import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import { withStyles } from 'material-ui/styles'
import EditIcon from 'material-ui-icons/ModeEdit'
import Dialog, { DialogActions, DialogTitle } from 'material-ui/Dialog'
import {FormattedMessage, defineMessages} from 'react-intl'
import assign from 'object-assign'
import {unflatten} from 'flat'

import MediaCarousel from './MediaCarousel'
import FeatureTable from '../shared/FeatureTable'
import {FIELD_TYPE_SPACE_DELIMITED, FORMATS_DEC_DEG} from '../../constants'

const styles = {
  root: {
    width: '100%',
    position: 'relative',
    backgroundColor: 'white'
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 500,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 0
  }
}

const messages = defineMessages({
  editButton: {
    id: 'feature.editButton',
    defaultMessage: 'Edit',
    description: 'Edit button label'
  },
  closeButton: {
    id: 'feature.closeButton',
    defaultMessage: 'Close',
    description: 'Close button label'
  },
  deleteButton: {
    id: 'feature.deleteButton',
    defaultMessage: 'Delete',
    description: 'Delete feature button label'
  },
  cancelButton: {
    id: 'feature.cancelButton',
    defaultMessage: 'Cancel',
    description: 'Cancel button label'
  },
  saveButton: {
    id: 'feature.saveButton',
    defaultMessage: 'Save',
    description: 'Save button label'
  }
})

const ViewActions = ({onCloseClick, onEditClick, classes}) => (
  <DialogActions>
    <Button
      raised
      icon={<EditIcon />}
      onClick={onEditClick}>
      <FormattedMessage {...messages.editButton} />
    </Button>
    <Button
      raised
      color='primary'
      onClick={onCloseClick}>
      <FormattedMessage {...messages.closeButton} />
    </Button>
  </DialogActions>
)

const EditActions = ({onCancelClick, onSaveClick, onDeleteClick, classes}) => (
  <DialogActions>
    <Button
      color='accent'
      raised
      onClick={onDeleteClick}>
      <FormattedMessage {...messages.deleteButton} />
    </Button>
    <Button
      raised
      onClick={onCancelClick}
      className={classes.button}>
      <FormattedMessage {...messages.cancelButton} />
    </Button>
    <Button
      raised
      color='primary'
      onClick={onSaveClick}>
      <FormattedMessage {...messages.saveButton} />
    </Button>
  </DialogActions>
)

class FeatureDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      confirmDelete: false
    }
    if (!props.feature) props.onRequestClose()
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.feature) return nextProps.onRequestClose()
  }

  handleEditClick = () => {
    this.setState({
      editMode: true,
      feature: this.props.feature
    })
  }

  handleCancelClick = () => {
    this.setState({editMode: false})
  }

  handleSaveClick = () => {
    if (this.state.feature !== this.props.feature) {
      const newFeature = untransformFeature(this.state.feature, this.props.fieldAnalysis)
      this.props.onEditFeature(newFeature)
    }
    this.setState({editMode: false})
  }

  handleValueChange = (key, value) => {
    const feature = this.state.feature
    const newFeature = assign({}, feature, {
      properties: assign({}, feature.properties, {
        [key]: value
      })
    })
    this.setState({feature: newFeature})
  }

  handleDeleteConfirm = () => {
    this.props.onDeleteFeature(this.props.feature.id)
    // this.props.onRequestClose()
  }

  render () {
    const {feature, onRequestClose, fieldOrder, classes, media,
      coordFormat, fieldAnalysis} = this.props
    const {editMode, feature: editedFeature} = this.state
    if (!feature) return null
    return <Paper className={classes.root} elevation={24}>
      <IconButton onClick={onRequestClose} className={classes.closeButton}>
        <CloseIcon />
      </IconButton>
      {!!media.length && <MediaCarousel media={media} />}
      <FeatureTable
        editMode={editMode}
        feature={editMode ? editedFeature : feature}
        fieldAnalysis={fieldAnalysis}
        fieldOrder={fieldOrder}
        coordFormat={coordFormat}
        onValueChange={this.handleValueChange}
      />
      {editMode
      ? <EditActions
        classes={classes}
        onCancelClick={this.handleCancelClick}
        onSaveClick={this.handleSaveClick}
        onDeleteClick={() => this.setState({confirmDelete: true})} />
      : <ViewActions
        classes={classes}
        onEditClick={this.handleEditClick}
        onCloseClick={onRequestClose} />}
      <Dialog ignoreBackdropClick open={this.state.confirmDelete} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Feature?</DialogTitle>
        <DialogActions>
          <Button onClick={() => this.setState({confirmDelete: false})} color='primary'>
            Cancel
          </Button>
          <Button onClick={this.handleDeleteConfirm} color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  }
}

FeatureDetail.propTypes = {
  feature: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  fieldOrder: PropTypes.object,
  classes: PropTypes.object.isRequired,
  media: PropTypes.arrayOf(PropTypes.shape({
    fieldname: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  coordFormat: PropTypes.string.isRequired,
  fieldAnalysis: PropTypes.object.isRequired,
  onDeleteFeature: PropTypes.func.isRequired,
  onEditFeature: PropTypes.func.isRequired
}

FeatureDetail.defaultProps = {
  coordFormat: FORMATS_DEC_DEG,
  media: [],
  fieldOrder: {}
}

// The selectors transform input features, we want to undo this before we save
function untransformFeature (feature, fieldAnalysis) {
  const newProps = {}
  const prevProps = feature.properties
  Object.keys(prevProps).forEach(function (key) {
    if (typeof prevProps[key] === 'string') {
      newProps[key] = prevProps[key].trim()
    }
    switch (fieldAnalysis.properties[key].type) {
      case FIELD_TYPE_SPACE_DELIMITED:
        newProps[key] = Array.isArray(prevProps[key]) ? prevProps[key].join(' ') : prevProps[key]
        break
      default:
        newProps[key] = prevProps[key]
    }
  })
  return unflatten(assign({}, feature, {
    properties: newProps
  }))
}

export default withStyles(styles)(FeatureDetail)
