import findIndex from 'lodash/findIndex'
import {EDIT_FEATURE} from '../constants'

const features = (state = [], action) => {
  switch (action.type) {
    case 'ADD_FEATURES':
      return [...state, ...action.payload]
    case EDIT_FEATURE:
      const newFeature = action.payload
      const newState = state.slice(0)
      const index = findIndex(state, {id: newFeature.id})
      newState[index] = newFeature
      return newState
    case 'REPLACE_FEATURES':
      return action.payload
  }
  return state
}

export default features
