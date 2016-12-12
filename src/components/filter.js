const React = require('react')
const { PropTypes } = React
const pure = require('recompose/pure').default
const FlatButton = require('material-ui/FlatButton').default
const Link = require('react-router/Link').default
const {List, ListItem} = require('material-ui/List')
const Divider = require('material-ui/Divider').default
const SettingsIcon = require('material-ui/svg-icons/action/settings').default
const {defineMessages, FormattedMessage} = require('react-intl')

const DiscreteFilter = require('./discrete_filter')
const DateFilter = require('./date_filter')
const {FILTER_TYPES} = require('../constants')

const style = {
  outer: {
    minWidth: 300,
    maxWidth: '33%',
    overflowY: 'auto',
    zIndex: 1,
    boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
  },
  list: {
    paddingTop: 0
  },
  listItemInner: {
    padding: 0
  },
  listIcon: {
    fill: 'rgb(117, 117, 117)',
    left: 0,
    top: 0,
    margin: '12px',
    position: 'absolute'
  },
  link: {
    color: '#000',
    display: 'block',
    padding: '16px 16px 16px 48px',
    textDecoration: 'none'
  }
}

const messages = defineMessages({
  changeFilters: {
    id: 'filter.change',
    defaultMessage: 'Change Filters…',
    description: 'Button text to change which fields are shown and filterable in the filter pane'
  }
})

const Filter = ({
  configureFilters = false,
  filters = {},
  fieldStats = {},
  visibleFilters = [],
  location,
  onUpdateFilter = (x) => x
}) => (
  <div style={style.outer}>
    <List style={style.list}>
      {visibleFilters.map((f) => {
        const field = fieldStats[f]
        const filter = filters[f]
        switch (field.filterType) {
          case FILTER_TYPES.DISCRETE:
            return (
              <div key={f}>
                <DiscreteFilter
                  fieldName={f}
                  checked={filter ? filter.in : Object.keys(field.values)}
                  values={field.values}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
          case FILTER_TYPES.RANGE:
            return
          case FILTER_TYPES.DATE:
            return (
              <div key={f}>
                <DateFilter
                  fieldName={f}
                  filter={filter}
                  min={filter ? filter['>='] : field.valueStats.min}
                  max={filter ? filter['<='] : field.valueStats.max}
                  valueMin={field.valueStats.min}
                  valueMax={field.valueStats.max}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
        }
      })}
      <ListItem innerDivStyle={style.listItemInner}>
        <Link
          style={style.link}
          to={{
            pathname: `${location.pathname}/settings/filters`,
            query: location.query
          }}><FormattedMessage {...messages.changeFilters} /> <SettingsIcon style={style.listIcon} /></Link>
      </ListItem>
    </List>
  </div>
)

Filter.propTypes = {
  configureFilters: PropTypes.bool,
  filters: PropTypes.object,
  fieldStats: PropTypes.object.isRequired,
  visibleFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.object.isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func
}

module.exports = pure(Filter)
