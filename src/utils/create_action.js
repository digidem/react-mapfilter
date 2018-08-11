// @flow
type Action = (state: Object, props: Object) => Object

// This function doesn't do anything other than add a hook for loggin
export default function createAction(action: Action): Action {
  return function(state, props) {
    // TODO: Logging can go here.
    return action(state, props)
  }
}
