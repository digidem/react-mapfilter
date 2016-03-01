const React = require('react')
const { connect } = require('react-redux')
const { bindActionCreators } = require('redux')

const MapView = require('../components/map_view')
const Filter = require('../components/filter')
const actionCreators = require('../action_creators')

const style = {
  width: '100vw',
  height: '100vh',
  position: 'relative'
}

const App = ({features, filter, updateFilter}) => (
  <div style={style}>
    <Filter
      features={features}
      filterFields={['people', 'happening']}
      filter={filter}
      onUpdate={updateFilter}
    />
    <MapView
      features={features}
      fieldMapping={{
        img: 'picture.url',
        title: 'happening',
        subtitle: 'placename'
      }}
      filter={filter}
    />
  </div>
)

module.exports = connect(
  (state) => state,
  (dispatch) => bindActionCreators(actionCreators, dispatch)
)(App)
