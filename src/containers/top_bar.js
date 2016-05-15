const React = require('react')
// const { Tabs, Tab } = require('material-ui/Tabs')
const AppBar = require('material-ui/AppBar').default

// const history = require('../history')

// function handleChange (location, value) {
//   history.push({
//     ...location,
//     pathname: '/' + value
//   })
// }

function TopBar ({location, params}) {
  return (
    <AppBar title='MapFilter' />
  )
}

module.exports = TopBar
