import findIndex from 'lodash/findIndex'
import {EDIT_FEATURE, DELETE_FEATURE} from '../constants'

const features = (state = [], action) => {
  let newState
  let index
  switch (action.type) {
    case 'ADD_FEATURES':
      return [...state, ...action.payload]
    case EDIT_FEATURE:
      const newFeature = action.payload
      newState = state.slice(0)
      index = findIndex(state, {id: newFeature.id})
      newState[index] = newFeature
      return newState
    case DELETE_FEATURE:
      index = findIndex(state, {id: action.payload})
      newState = state.slice(0)
      newState.splice(index, 1)
      return newState
    case 'REPLACE_FEATURES':
      return action.payload
  }
  return state
}

export default features
