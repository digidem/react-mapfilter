const assign = require('object-assign')

// Private action type for controlled-store
const ActionTypes = {
  UPDATE: '@@controlled/UPDATE'
}

/**
 * A Redux store enhancer that allows a redux app to operate as a controlled
 * component, selectively moving state out of the app and into a container.
 *
 * Enhances the store with an additional method `controlledUpdate()` that will
 * override the redux store state. Any keys on the state object passed to
 * `controlledUpdate()` will be "locked" in that any actions in the app will no
 * longer directly update that part of the state, but instead call the `onChange`
 * function passed to the constructor, with the state key that has been updated
 * and the new value.
 *
 * @param {Function} onChange
 * @param {Object} stateOverride
 * @return {Function} Redux Store Enhancer
 */
module.exports = (onChange, initialStateOverride = {}) => (createStore) => {
  // These properties of the app state are now controlled
  let controlledProps = Object.keys(initialStateOverride)

  return (reducer, initialState, enhancer) => {
    initialState = assign({}, initialState, initialStateOverride)
    // Create the store with an enhanced reducer
    const store = createStore(controlledReducer, initialState, enhancer)

    // Enhance the store with an additional method `controlledUpdate()`
    return assign({}, store, {
      controlledUpdate
    })

    function controlledReducer (state, action) {
      // Controlled updates skip app reducers and override the state
      if (action.type === ActionTypes.UPDATE) {
        return assign({}, state, action.payload)
      }
      let hasChanged = false
      const newState = reducer(state, action)
      Object.keys(newState).forEach(key => {
        if (newState[key] === state[key]) return
        if (controlledProps.indexOf(key) > -1) {
          // If any controlled props of the state are updated, we hide the
          // initial change in state from the redux store and instead
          // call the `onChange` function with the key that has been updated
          // and the new value. Needs to run on nextTick to avoid `controlledUpdate()`
          // being called in the same tick and resulting in a `store.dispatch()`
          // inside this reducer.
          const value = newState[key]
          process.nextTick(() => onChange(key, value))
          newState[key] = state[key]
        } else {
          // Unless an uncontrolled prop has been changed, we'll just return the existing state
          hasChanged = true
        }
      })
      return hasChanged ? newState : state
    }

    function controlledUpdate (stateOverride) {
      controlledProps = Object.keys(stateOverride)
      store.dispatch({
        type: ActionTypes.UPDATE,
        payload: stateOverride
      })
    }
  }
}
