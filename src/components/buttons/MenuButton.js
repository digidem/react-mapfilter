import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuIcon from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { injectIntl, defineMessages } from 'react-intl'
import { saveAs } from 'file-saver'
import { csvFormat } from 'd3-dsv'
import assign from 'object-assign'
import moment from 'moment'

import * as MFPropTypes from '../../util/prop_types'
import CustomContainer from '../../containers/ViewContainer'
import {FIELD_TYPE_DATE, UNDEFINED_KEY} from '../../constants'
import { unflatten } from '../../util/flat';

const messages = defineMessages({
  settings: {
    id: 'menu.settings',
    defaultMessage: 'Settings'
  },
  menu: {
    id: 'buttons.menu',
    defaultMessage: 'Menu'
  },
  exportGeoJSON: {
    id: 'menu.exportGeoJSON',
    defaultMessage: 'Export GeoJSON…',
    description: 'Menu item to export GeoJSON data'
  },
  exportCSV: {
    id: 'menu.exportCSV',
    defaultMessage: 'Export CSV…',
    description: 'Menu item to export CSV data'
  }
})

class MenuButton extends React.Component {
  state = {open: false}

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget })
  }

  handleRequestClose = () => {
    this.setState({open: false})
  }

  handleExportGeoJSONClick = () => {
    const features = this.props.features.map(f => {
      const newProps = {}
      for (var prop in f.properties) {
        if (f.properties[prop] !== UNDEFINED_KEY) newProps[prop] = f.properties[prop]
      }
      return Object.assign({}, f, {properties: unflatten(newProps)})
    })
    const geojson = {
      type: 'FeatureCollection',
      features: features
    }
    const blob = new window.Blob([JSON.stringify(geojson, null, 2)], {type: 'application/json'})
    saveAs(blob, 'data.geojson')
  }

  handleExportCSVClick = () => {
    const {fieldAnalysis} = this.props
    const columns = []
    const rows = this.props.features
      .map(function (feature) {
        const row = Object.assign({}, feature.properties)
        Object.keys(row).forEach(key => {
          if (fieldAnalysis.properties[key] && fieldAnalysis.properties[key].type === FIELD_TYPE_DATE) {
            if (typeof row[key] === 'number' && !Number.isNaN(row[key])) {
              row[key] = moment(row[key]).format('YYYY-MM-DD HH:mm:ss')
            } else {
              row[key] = ''
            }
          }
          if (row[key] === UNDEFINED_KEY) {
            row[key] = ''
          }
          if (columns.indexOf(key) === -1) {
            columns.push(key)
          }
        })
        if (feature.geometry && feature.geometry.type === 'Point') {
          return assign({}, row, {
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1]
          })
        }
        return row
      })
      .filter(Boolean)
    const csv = csvFormat(rows, columns.sort().concat(['lon', 'lat']))
    const blob = new window.Blob([csv], {type: 'text/csv'})
    saveAs(blob, 'data.csv')
  }

  render () {
    const {intl: {formatMessage}, openSettings, menuItems} = this.props
    const name = formatMessage(messages.menu)
    return <div>
      <Tooltip title={name}>
        <IconButton
          aria-owns={this.state.open ? 'toolbar-menu' : null}
          aria-haspopup='true'
          onClick={this.handleClick}
          aria-label={name}>
          <MenuIcon nativeColor='white' />
        </IconButton>
      </Tooltip>
      <Menu
        open={this.state.open}
        MenuListProps={{dense: true}}
        id='toolbar-menu'
        anchorEl={this.state.anchorEl}
        onClick={this.handleRequestClose}
        onClose={this.handleRequestClose}>
        <MenuItem onClick={() => openSettings('general')}>{formatMessage(messages.settings)}</MenuItem>
        <MenuItem onClick={this.handleExportGeoJSONClick}>{formatMessage(messages.exportGeoJSON)}</MenuItem>
        <MenuItem onClick={this.handleExportCSVClick}>{formatMessage(messages.exportCSV)}</MenuItem>
        {menuItems.length === 0 ? null : menuItems.map((menuItem, i) => (
          <CustomContainer key={i} component={menuItem} />
        )) }
      </Menu>
    </div>
  }
}

MenuButton.defaultProps = {
  menuItems: []
}

MenuButton.propTypes = {
  features: MFPropTypes.features,
  intl: PropTypes.object.isRequired,
  openSettings: PropTypes.func.isRequired
}

export default injectIntl(MenuButton)
