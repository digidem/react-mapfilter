// @flow
import * as React from 'react'

import { guessFieldDefinitions } from '../../utils/field_types'

import type { FieldDefinition, PointFeature } from '../../types'

export const {
  Provider,
  Consumer
}: React.Context<
  (
    feature: PointFeature,
    features: Array<PointFeature>
  ) => Array<FieldDefinition>
> = React.createContext(guessFieldDefinitions)
