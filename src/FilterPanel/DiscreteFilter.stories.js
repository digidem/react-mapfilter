// @flow
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react'
import DateFnsUtils from '@date-io/date-fns' // choose your lib
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DiscreteFilter from './DiscreteFilter'
import List from '@material-ui/core/List'

export default {
  title: 'FilterPanel/components/DiscreteFilter',
  decorators: [
    (storyFn: any) => (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <List style={{ width: '100%', maxWidth: 360 }}>{storyFn()}</List>
      </MuiPickersUtilsProvider>
    )
  ]
}

const values = [
  { value: 'foo', label: 'Foo' },
  { value: 'bar', label: 'Bar' },
  { value: 'qux', label: 'Qux' }
]

export const defaultStory = () => {
  const [filter, setFilter] = React.useState()
  console.log(filter)
  return (
    <DiscreteFilter
      label="Happening"
      values={values}
      fieldKey={['foo']}
      filter={filter}
      onChangeFilter={setFilter}
    />
  )
}

defaultStory.story = {
  name: 'default'
}
