// @flow
type Action = (state: Object, props: Object) => Object

export default function createAction(action: Action): Action {
  return function(state, props) {
    // TODO: Logging can go here.
    return action(state, props)
  }
}
