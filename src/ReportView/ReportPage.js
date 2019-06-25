// @flow
import React from 'react'
import FeatureHeader from '../internal/FeatureHeader'
import Image from '../internal/Image'
import DetailsTable from '../internal/DetailsTable'

import type { Coordinates, Field } from '../types'

type Props = {
  name: string,
  iconLabel?: string,
  iconColor?: string,
  coords?: Coordinates,
  createdAt?: Date,
  imageSrc?: string,
  fields: Array<Field>,
  tags: {}
}

const ReportPageContents = ({
  name,
  iconLabel,
  iconColor,
  coords,
  createdAt,
  imageSrc,
  fields,
  tags
}: Props) => (
  <>
    <FeatureHeader
      name="Observation"
      iconLabel="C"
      iconColor="red"
      coords={{ longitude: -51, latitude: 23 }}
      createdAt={new Date()}
    />
    <Image
      style={{
        width: '100%',
        height: '12cm',
        borderTop: '1px solid rgb(224, 224, 224)',
        borderBottom: '1px solid rgb(224, 224, 224)'
      }}
      src="https://lorempixel.com/640/480/nature/1"
    />
    <DetailsTable fields={fields} tags={tags} />
  </>
)

export default ReportPageContents
