import React from 'react'

import { connect } from 'react-redux'
import { CardActions } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'
import EditIcon from 'material-ui-icons/ModeEdit'
import {FormattedMessage, defineMessages} from 'react-intl'
import assign from 'object-assign'
import {unflatten} from 'flat'
import classNames from 'classnames'

import getFeaturesById from '../../selectors/features_by_id'
import getFieldMapping from '../../selectors/field_mapping'
import getVisibleFields from '../../selectors/visible_fields'
import getFieldAnalysis from '../../selectors/field_analysis'
import Image from '../image'
import FeatureTable from '../shared/table'
import {updateVisibleFields, editFeature} from '../../action_creators'
import {FIELD_TYPE_SPACE_DELIMITED} from '../../constants'

const styleSheet = {
  card: {
    width: '100%',
    position: 'relative'
  },
  cardUnrestricted: {
    width: '100%'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  markerIcon: {
    width: 40,
    height: 40,
    margin: 0,
    marginRight: 16
  },
  media: {
    position: 'relative',
    height: '100%',
    padding: '67% 0 0 0'
  },
  img: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    objectFit: 'cover',
    transform: 'translate3d(0,0,0)'
  },
  button: {
    margin: '8px 16px 8px 8px'
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 5
  },
  actions: {
    justifyContent: 'flex-end',
    paddingBottom: 8
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

const Actions = ({editMode, onCloseClick, onEditClick, onCancelClick, onSaveClick, classes}) => (
  editMode
  ? <CardActions className={classes.actions}>
    <Button
      raised
      onClick={onCancelClick}
      className={classes.button}
    ><FormattedMessage {...messages.cancelButton} /></Button>
    <Button
      raised
      color='primary'
      onClick={onSaveClick}
      className={classes.button}
    ><FormattedMessage {...messages.saveButton} /></Button>
  </CardActions>
  : <CardActions className={classes.actions}>
    <Button
      raised
      icon={<EditIcon />}
      onClick={onEditClick}
      className={classes.button}
    ><FormattedMessage {...messages.editButton} /></Button>
    <Button
      raised
      color='primary'
      onClick={onCloseClick}
      className={classes.button}
    ><FormattedMessage {...messages.closeButton} /></Button>
  </CardActions>
)

class FeatureDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false
    }
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleCancelClick = this.handleCancelClick.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
  }

  handleEditClick () {
    this.setState({
      editMode: true,
      feature: this.props.feature,
      visibleFields: this.props.visibleFields
    })
  }

  handleCancelClick () {
    this.setState({editMode: false})
  }

  handleSaveClick () {
    if (this.state.feature !== this.props.feature) {
      const newFeature = untransformFeature(this.state.feature, this.props.fieldAnalysis)
      this.props.onEditFeature(newFeature)
    }
    if (this.state.visibleFields !== this.props.visibleFields) {
      this.props.onEditHiddenFields(this.state.visibleFields)
    }
    this.setState({editMode: false})
  }

  handleVisibilityChange (key, visible) {
    const visibleFields = visible
      ? this.state.visibleFields.concat([key])
      : this.state.visibleFields.filter(fieldname => fieldname !== key)
    this.setState({visibleFields: visibleFields})
  }

  handleValueChange (key, value) {
    const feature = this.state.feature
    const newFeature = assign({}, feature, {
      properties: assign({}, feature.properties, {
        [key]: value
      })
    })
    this.setState({feature: newFeature})
  }

  render () {
    const {media, feature, onCloseClick, fieldOrder, classes, className,
      coordFormat, fieldAnalysis, visibleFields} = this.props
    const {editMode, feature: editedFeature, visibleFields: editedVisibleFields} = this.state
    return <Paper className={classNames(classes.card, className)} elevation={8}>
      {media &&
        <div className={classes.media}>
          <Image className={classes.img} src={media} />
        </div>}
      <FeatureTable
        editMode={editMode}
        feature={editMode ? editedFeature : feature}
        fieldAnalysis={fieldAnalysis}
        fieldOrder={fieldOrder}
        visibleFields={editMode ? editedVisibleFields : visibleFields}
        coordFormat={coordFormat}
        onVisibilityChange={this.handleVisibilityChange}
        onValueChange={this.handleValueChange}
      />
      <Actions
        classes={classes}
        style={{textAlign: 'right'}}
        editMode={editMode}
        onChangeProp={this.handlePropEdit}
        onEditClick={this.handleEditClick}
        onCloseClick={onCloseClick}
        onCancelClick={this.handleCancelClick}
        onSaveClick={this.handleSaveClick}
      />
    </Paper>
  }
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

export default connect(
  (state, ownProps) => {
    const featuresById = getFeaturesById(state)
    const fieldMapping = getFieldMapping(state)
    const visibleFields = getVisibleFields(state)
    const fieldAnalysis = getFieldAnalysis(state)
    const id = ownProps.id || state.ui.featureId
    const feature = featuresById[id]
    if (!feature) return {}
    const geojsonProps = feature.properties
    return {
      coordFormat: state.settings.coordFormat,
      feature: feature,
      fieldAnalysis: fieldAnalysis,
      fieldOrder: state.fieldOrder,
      visibleFields: visibleFields,
      media: geojsonProps[fieldMapping.media]
    }
  },
  (dispatch) => ({
    onEditFeature: (feature) => dispatch(editFeature(feature)),
    onEditHiddenFields: (visibleFields) => dispatch(updateVisibleFields(visibleFields))
  })
)(withStyles(styleSheet)(FeatureDetail))
