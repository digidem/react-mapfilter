// @flow
import React, { useState } from 'react'

import { SelectOne } from './Select'

const countries = [
  { label: 'Afghanistan', value: true },
  { label: 'Aland Islands', value: 'aland_islands' },
  { label: 'Albania', value: 1 },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  {
    label:
      'Bolivia, Plurinational State of really long name to confuse rendering'
  },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' }
].map(item => ({ label: item.label, value: item.value || item.label }))

const StateContainer = ({ children }) => {
  const [state, setState] = useState('')
  return children(state, setState)
}

export default {
  title: 'internal/SelectOne'
}

export const defaultStory = () => (
  <StateContainer>
    {(value, setValue) => (
      <SelectOne suggestions={countries} value={value} onChange={setValue} />
    )}
  </StateContainer>
)

defaultStory.story = {
  name: 'default'
}
