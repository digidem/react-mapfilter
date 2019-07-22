// @flow
import React from 'react'
import { makeStyles } from '@material-ui/styles'
import FeatureHeader from '../internal/FeatureHeader'
import Image from '../internal/Image'
import DetailsTable from '../internal/DetailsTable'
import { cm, inch } from '../utils/dom'

import type { Coordinates, Field, JSONObject, PaperSize } from '../types'

const useStyles = makeStyles({
  imageWrapper: {
    width: '100%',
    height: '12cm',
    borderTop: '1px solid rgb(224, 224, 224)',
    borderBottom: '1px solid rgb(224, 224, 224)'
  }
})

type Props = {|
  name?: string,
  iconLabel?: string,
  iconColor?: string,
  coords?: Coordinates,
  createdAt?: Date,
  imageSrc?: string,
  fields: Array<Field>,
  tags?: JSONObject,
  paperSize: PaperSize
|}

const ReportPageContent = ({
  name,
  iconLabel,
  iconColor,
  coords,
  createdAt,
  imageSrc,
  fields,
  tags,
  paperSize
}: Props) => {
  const classes = useStyles()

  return (
    <>
      <FeatureHeader
        name={name}
        iconLabel={iconLabel}
        iconColor={iconColor}
        coords={coords}
        createdAt={createdAt}
      />
      {imageSrc && (
        <div className={classes.imageWrapper}>
          <Image style={{ width: '100%', height: '12cm' }} src={imageSrc} />
        </div>
      )}
      {tags && (
        <DetailsTable
          fields={fields}
          tags={tags}
          width={paperSize === 'a4' ? 21 * cm() - inch() : 7.5 * inch()}
        />
      )}
    </>
  )
}

export default ReportPageContent
