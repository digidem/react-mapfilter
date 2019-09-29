// @flow
import React from 'react'

import type { Observation } from 'mapeo-schema'
import type { Filter } from '../types'

type Props = {
  filter: Filter,
  setFilter: Filter => void,
  observations: Observation[]
}

const FilterPane = ({ filter, setFilter, observations }: Props) => {}

export default FilterPane
