// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react'
import DateFnsUtils from '@date-io/date-fns' // choose your lib
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import FilterPanel from './FilterPanel'
import type { Preset } from 'mapeo-schema'
import fixtureObs from '../../fixtures/observations.json'

export default {
  title: 'FilterPanel',
  decorators: [
    (storyFn: any) => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ maxWidth: 400, height: '100vh', display: 'flex' }}>
          {storyFn()}
        </div>
      </MuiPickersUtilsProvider>
    )
  ]
}

export const minimal = () => {
  const [filter, setFilter] = React.useState(null)
  console.log(filter)
  return <FilterPanel filter={filter} onChangeFilter={setFilter} />
}

const presets: Preset[] = [
  {
    name: 'Mining',
    id: 'mining',
    geometry: ['point'],
    tags: {}
  },
  {
    name: 'Logging',
    id: 'logging',
    geometry: ['point'],
    tags: {}
  },
  {
    name: 'Oil Spill',
    id: 'oil',
    geometry: ['point'],
    tags: {}
  }
]

export const withPresets = () => {
  const [filter, setFilter] = React.useState(null)
  console.log(filter)
  return (
    <FilterPanel filter={filter} onChangeFilter={setFilter} presets={presets} />
  )
}

export const withObservations = () => {
  const [filter, setFilter] = React.useState(null)
  console.log(filter)
  return (
    <FilterPanel
      filter={filter}
      observations={fixtureObs}
      onChangeFilter={setFilter}
      presets={presets}
    />
  )
}
