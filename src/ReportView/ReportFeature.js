import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import Image from '../Image'
import MarkerIcon from './MarkerIcon'
import * as MFPropTypes from '../../util/prop_types'
import FormattedValue from '../Shared/FormattedValue'
import FeatureTable from '../Shared/FeatureTable'

const styles = {
  root: {
    backgroundColor: 'white'
  },
  header: {
    display: 'flex',
    padding: 16,
    alignItems: 'center'
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: 16
  },
  headerContent: {
    flex: '1 1 auto'
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
  }
}

const ReportFeature = ({
  label,
  classes,
  colorIndex,
  feature,
  fieldAnalysis,
  fieldMapping,
  fieldOrder,
  settings,
  hiddenFields
}) => {
  const props = feature.properties
  const media = props[fieldMapping.media]
  const title = props[fieldMapping.title]
  const subtitle = props[fieldMapping.subtitle]
  const color =
    colorIndex[props[fieldMapping.color]] ||
    (props[fieldMapping.color] && colorIndex[props[fieldMapping.color][0]])
  const analysisProps = fieldAnalysis.properties
  const titleType =
    analysisProps[fieldMapping.title] && analysisProps[fieldMapping.title].type
  const subtitleType =
    analysisProps[fieldMapping.subtitle] &&
    analysisProps[fieldMapping.subtitle].type

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.avatar}>
          <MarkerIcon
            color={color}
            className={classes.markerIcon}
            label={label}
          />
        </div>
        <div className={classes.headerContent}>
          <Typography variant="title">
            <FormattedValue value={title} type={titleType} />
          </Typography>
          <Typography variant="subheading">
            <FormattedValue value={subtitle} type={subtitleType} />
          </Typography>
        </div>
      </div>
      {media && (
        <div className={classes.media}>
          <Image className={classes.img} src={media} />
        </div>
      )}
      <FeatureTable
        feature={feature}
        fieldAnalysis={fieldAnalysis}
        fieldOrder={fieldOrder}
        hiddenFields={hiddenFields}
        coordFormat={settings.coordFormat}
      />
    </div>
  )
}

ReportFeature.propTypes = {
  label: PropTypes.string,
  classes: PropTypes.object.isRequired,
  settings: MFPropTypes.settings.isRequired,
  colorIndex: MFPropTypes.colorIndex.isRequired,
  feature: MFPropTypes.feature.isRequired,
  fieldAnalysis: MFPropTypes.fieldAnalysis.isRequired,
  fieldMapping: MFPropTypes.fieldMapping.isRequired,
  fieldOrder: PropTypes.object,
  hiddenFields: PropTypes.object
}

export default withStyles(styles)(ReportFeature)
