import React from 'react'

import { connect } from 'react-redux'
import { CardMedia, CardContent, CardHeader, CardActions } from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import { withStyles } from 'material-ui/styles'
import EditIcon from 'material-ui-icons/ModeEdit'
import CloseIcon from 'material-ui-icons/Close'
import {FormattedMessage, defineMessages} from 'react-intl'
import assign from 'object-assign'
import {unflatten} from 'flat'

import FormattedValue from '../shared/formatted_value'
import getFeaturesById from '../../selectors/features_by_id'
import getFieldMapping from '../../selectors/field_mapping'
import getColorIndex from '../../selectors/color_index'
import getVisibleFields from '../../selectors/visible_fields'
import getFieldAnalysis from '../../selectors/field_analysis'
import Image from '../image'
import MarkerIcon from './marker_icon'
import FeatureTable from './feature_table'
import {updateVisibleFields, editFeature} from '../../action_creators'
import {FIELD_TYPE_SPACE_DELIMITED} from '../../constants'

const styleSheet = {
  card: {
    overflow: 'auto',
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
    objectFit: 'cover'
  },
  button: {
    margin: '8px 16px 8px 8px'
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5
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
  ? <CardActions className='no_print'>
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
  : <CardActions className='no_print'>
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
    const {color, label, media, feature, title, subtitle, onCloseClick, fieldOrder, classes,
      print, coordFormat, fieldAnalysis, visibleFields, titleType, subtitleType} = this.props
    const {editMode, feature: editedFeature, visibleFields: editedVisibleFields} = this.state
    return <Paper className={classes.card} elevation={onCloseClick ? 8 : 0}>
      {onCloseClick && <IconButton onClick={onCloseClick} className={classes.closeButton}>
        <CloseIcon />
      </IconButton>}
      <CardHeader
        avatar={<MarkerIcon color={color} className={classes.markerIcon} label={label} />}
        title={<FormattedValue value={title} type={titleType} />}
        subheader={<FormattedValue value={subtitle} type={subtitleType} />} />
      <div>
        {media &&
          <CardMedia className={classes.media}>
            <Image className={classes.img} src={media} />
          </CardMedia>}
        <CardContent>
          <FeatureTable
            editMode={editMode}
            feature={editMode ? editedFeature : feature}
            fieldAnalysis={fieldAnalysis}
            fieldOrder={fieldOrder}
            visibleFields={editMode ? editedVisibleFields : visibleFields}
            print={print}
            coordFormat={coordFormat}
            onVisibilityChange={this.handleVisibilityChange}
            onValueChange={this.handleValueChange}
          />
        </CardContent>
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
      </div>
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
    const colorIndex = getColorIndex(state)
    const fieldMapping = getFieldMapping(state)
    const visibleFields = getVisibleFields(state)
    const fieldAnalysis = getFieldAnalysis(state)
    const id = ownProps.id || state.ui.featureId
    const feature = featuresById[id]
    if (!feature) return {}
    const geojsonProps = feature.properties
    const fieldAnalysisProps = fieldAnalysis.properties
    return {
      coordFormat: state.settings.coordFormat,
      feature: feature,
      fieldAnalysis: fieldAnalysis,
      fieldOrder: state.fieldOrder,
      visibleFields: visibleFields,
      media: geojsonProps[fieldMapping.media],
      title: geojsonProps[fieldMapping.title],
      subtitle: geojsonProps[fieldMapping.subtitle],
      color: colorIndex[geojsonProps[fieldMapping.color]] || (geojsonProps[fieldMapping.color] && colorIndex[geojsonProps[fieldMapping.color][0]]),
      titleType: fieldAnalysisProps[fieldMapping.title] && fieldAnalysisProps[fieldMapping.title].type,
      subtitleType: fieldAnalysisProps[fieldMapping.subtitle] && fieldAnalysisProps[fieldMapping.subtitle].type
    }
  },
  (dispatch) => ({
    onEditFeature: (feature) => dispatch(editFeature(feature)),
    onEditHiddenFields: (visibleFields) => dispatch(updateVisibleFields(visibleFields))
  })
)(withStyles(styleSheet)(FeatureDetail))
