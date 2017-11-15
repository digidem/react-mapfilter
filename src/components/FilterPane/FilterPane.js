import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import List, {ListItem, ListItemIcon, ListItemText} from 'material-ui/List'
import Divider from 'material-ui/Divider'
import SettingsIcon from 'material-ui-icons/Settings'
import Paper from 'material-ui/Paper'
import {defineMessages, FormattedMessage} from 'react-intl'

import DiscreteFilter from './DiscreteFilter'
import DateFilter from './DateFilter'
import {
  FILTER_TYPE_DISCRETE,
  FILTER_TYPE_RANGE,
  FILTER_TYPE_DATE,
  FILTER_TYPE_TEXT
} from '../../constants'

const styles = {
  root: {
    minWidth: 300,
    flex: 1,
    overflowY: 'auto',
    zIndex: 20,
    // backgroundColor: 'white',
    '@media print': {
      display: 'none'
    }
  },
  list: {
    paddingTop: 0
  },
  listItemInner: {
    padding: 0
  },
  listItemText: {
    padding: '0 16px 0 0'
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

const FilterPane = ({
  classes,
  filters = {},
  fieldStats = {},
  filterFields = [],
  coloredField,
  colorIndex,
  onUpdateFilter = x => x,
  onClickSettings = x => x
}) => (
  <Paper className={classes.root} elevation={3}>
    <List className={classes.list} dense>
      {/* TODO allow these to be reordered */}
      {filterFields.map((f) => {
        const field = fieldStats.properties[f] || {}
        const filter = filters[f]
        switch (field.filterType) {
          case FILTER_TYPE_DISCRETE:
            return (
              <div key={f}>
                <DiscreteFilter
                  fieldName={f}
                  checked={filter ? filter.in : field.values.map(v => v.value)}
                  values={field.values}
                  colored={coloredField === f || coloredField + '.0' === f}
                  colorIndex={colorIndex}
                  onUpdate={onUpdateFilter} />
                <Divider />
              </div>
            )
          case FILTER_TYPE_RANGE:
            return
          case FILTER_TYPE_TEXT:
            return
          case FILTER_TYPE_DATE:
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
      <ListItem button onClick={onClickSettings}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          classes={{root: classes.listItemText}}
          primary={<FormattedMessage {...messages.changeFilters} />}
        />
      </ListItem>
    </List>
  </Paper>
)

FilterPane.propTypes = {
  filters: PropTypes.object,
  fieldStats: PropTypes.object.isRequired,
  filterFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  /* called with valid mapbox-gl filter when updated */
  onUpdateFilter: PropTypes.func,
  onClickSettings: PropTypes.func
}

export default withStyles(styles)(FilterPane)
