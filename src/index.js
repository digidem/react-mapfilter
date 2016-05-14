const React = require('react')
const ReactDOM = require('react-dom')
const App = require('./containers/app')

// Needed by material-ui for onTouchTap to work
require('react-tap-event-plugin')()

ReactDOM.render(<App />, document.getElementById('root'))
