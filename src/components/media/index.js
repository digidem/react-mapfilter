import React from 'react'

import ImageGrid from './image_grid'
import { FIELD_TYPE_IMAGE } from '../../constants'

class MediaView extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.fieldAnalysis !== this.props.fieldAnalysis ||
      nextProps.filteredFeatures !== this.props.filteredFeatures
  }

  getImages () {
    const {fieldAnalysis, filteredFeatures} = this.props
    const imageFieldNames = Object.keys(fieldAnalysis.properties).filter(
      fieldname => fieldAnalysis.properties[fieldname].type === FIELD_TYPE_IMAGE
    )
    return filteredFeatures.reduce((p, feature) => {
      imageFieldNames.forEach(f => {
        if (feature.properties[f]) {
          p.push({
            url: feature.properties[f],
            featureId: feature.id
          })
        }
      })
      return p
    }, [])
  }

  render () {
    const {showFeatureDetail} = this.props
    const images = this.getImages()
    return <ImageGrid images={images} onImageClick={showFeatureDetail} />
  }
}

MediaView.MfViewId = 'media'

export default MediaView
