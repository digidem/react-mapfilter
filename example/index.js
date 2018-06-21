const React = require('react')
const ReactDOM = require('react-dom')
const MapFilter = require('../src/index.js').default
const createHistory = require('history').createBrowserHistory
const { MuiThemeProvider, createMuiTheme } = require('@material-ui/core/styles')
const blue = require('@material-ui/core/colors/blue').default
const pink = require('@material-ui/core/colors/pink').default
const mapboxgl = require('mapbox-gl')

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink
  }
})

const features = require('./sample.json').features

const history = createHistory()

const pathRegExp = /^(?:\/((?:[^/]+?)))?(?:\/((?:[^/]+?)))?(?:\/((?:[^/]+?)))?(?:\/(?=$))?$/

function uiFromPath (path) {
  const match = pathRegExp.exec(path)
  if (!match) return {}
  return {
    activeView: match[1],
    activeModal: match[2] && match[2].replace('features', 'feature'),
    settingsTab: match[2] === 'settings' && match[3],
    featureId: match[2] === 'features' && match[3]
  }
}

function pathFromUi (ui) {
  let path = '/'
  if (ui.activeView) path += ui.activeView + '/'
  if (ui.activeModal === 'settings') path += 'settings/' + ui.settingsTab + '/'
  if (ui.activeModal === 'feature') path += 'features/' + ui.featureId + '/'
  return path
}

function resizer (src, size) {
  return 'https://resizer.digital-democracy.org/{width}/{height}/{url}'
    .replace('{width}', size)
    .replace('{height}', size)
    .replace('{url}', src)
}

class Example extends React.Component {
  constructor (props) {
    super(props)
    this.history = createHistory()
    this.unlisten = history.listen(this.handleHistoryChange)
    this.state = {
      ui: uiFromPath(history.location.pathname),
      features: features
    }
  }
  handleHistoryChange = (location, action) => {
    if (action === 'POP') {
      this.setState({ui: uiFromPath(location.pathname)})
    }
  }
  handleChangeUi = (ui) => {
    const path = pathFromUi(ui)
    ui.amberirect ? history.replace(path) : history.push(path)
    this.setState({ui})
  }
  handleChangeFeatures = (_) => {
    this.setState({features: _})
  }
  render () {
    return <MuiThemeProvider theme={theme}>
      <MapFilter
        resizer={resizer}
        features={this.state.features}
        fieldOrder={{caption: 1, public: 0}}
        ui={this.state.ui}
        mapControls={[new mapboxgl.FullscreenControl()]}
        onChangeUi={this.handleChangeUi}
        onChangeFeatures={this.handleChangeFeatures} />
    </MuiThemeProvider>
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
