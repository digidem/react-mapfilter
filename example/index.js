const React = require('react')
const ReactDOM = require('react-dom')
const MapFilter = require('../src/index.js')
const fs = require('fs')
const path = require('path')
const createHistory = require('history').createBrowserHistory

const sampleGeoJSON = fs.readFileSync(path.join(__dirname, './sample.geojson'), 'utf8')
const features = JSON.parse(sampleGeoJSON).features

const history = createHistory()

class Example extends React.Component {
  constructor (props) {
    super(props)
    this.history = createHistory()
    this.unlisten = history.listen(this.handleHistoryChange)
    this.state = {
      route: history.location.pathname
    }
  }
  handleHistoryChange = (location, action) => {
    if (action === 'POP') {
      this.setState({route: location.pathname})
    }
  }
  handleChangeRoute = (route) => {
    history.push(route)
    this.setState({route})
  }
  render () {
    return <MapFilter features={features} route={this.state.route} onChangeRoute={this.handleChangeRoute} />
  }
}

ReactDOM.render(<Example />, document.getElementById('root'))
