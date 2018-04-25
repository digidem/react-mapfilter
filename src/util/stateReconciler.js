import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'

module.exports = function (state, inboundState, reducedState, log) {
  let newState = Object.assign({}, reducedState)
    Object.keys(inboundState).forEach((key) => {
      // if initialState does not have key, skip auto rehydration
      if (!state.hasOwnProperty(key)) return

      // if initial state is an object but inbound state is null/undefined, skip
      if (typeof state[key] === 'object' && !inboundState[key]) {
        if (log) console.log('redux-persist/autoRehydrate: sub state for key `%s` is falsy but initial state is an object, skipping autoRehydrate.', key)
      return
      }

    // if reducer modifies substate, skip auto rehydration
    if (state[key] !== reducedState[key]) {
      if (log) console.log('redux-persist/autoRehydrate: sub state for key `%s` modified, skipping autoRehydrate.', key)
      newState[key] = reducedState[key]
      return
    }

    // otherwise take the inboundState
    if (isStatePlainEnough(inboundState[key]) && isStatePlainEnough(state[key])) {
      if (controllableProps.indexOf(key) > -1) {
        newState[key] = state[key]
      } else newState[key] = merge(state[key], inboundState[key])
    } else newState[key] = inboundState[key] // hard set

      if (log) console.log('redux-persist/autoRehydrate: key `%s`, rehydrated to ', key, newState[key])
    })
  return newState
}

function isStatePlainEnough (a) {
  // isPlainObject + duck type not immutable
  if (!a) return false
  if (typeof a !== 'object') return false
  if (typeof a.asMutable === 'function') return false
  if (!isPlainObject(a)) return false
  return true
}
