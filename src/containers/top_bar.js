const React = require('react')
const { Tabs, Tab } = require('material-ui/lib/tabs')
const AppBar = require('material-ui/lib/app-bar')

const history = require('../history')

function handleChange (location, value) {
  history.push({
    ...location,
    pathname: '/' + value
  })
}

function TopBar ({location, params}) {
  return (
    <AppBar title='MapFilter'>
      <Tabs
        value={params.view}
        onChange={handleChange.bind(undefined, location)}
        style={{maxWidth: 400}}
        inkBarStyle={{transition: 'none', height: 4, marginTop: -4}}
      >
        <Tab label='Map' value='map' style={{height: '100%'}} />
        <Tab label='List' value='list' />
        <Tab label='Photos' value='photo' />
      </Tabs>
    </AppBar>
  )
}

module.exports = TopBar
