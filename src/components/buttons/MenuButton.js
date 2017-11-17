import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'
import Tooltip from 'material-ui/Tooltip'
import MenuIcon from 'material-ui-icons/MoreVert'
import Menu, {MenuItem} from 'material-ui/Menu'
import { injectIntl, defineMessages } from 'react-intl'
import { saveAs } from 'file-saver'
import { csvFormat } from 'd3-dsv'
import assign from 'object-assign'

import * as MFPropTypes from '../../util/prop_types'

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
    const geojson = {
      type: 'FeatureCollection',
      features: this.props.features
    }
    const blob = new window.Blob([JSON.stringify(geojson, null, 2)], {type: 'application/json'})
    saveAs(blob, 'data.geojson')
  }

  handleExportCSVClick = () => {
    const rows = this.props.features
      .map(function (feature) {
        if (feature.geometry && feature.geometry.type === 'Point') {
          return assign({}, feature.properties, {
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1]
          })
        }
        return feature.properties
      })
      .filter(Boolean)
    const csv = csvFormat(rows)
    const blob = new window.Blob([csv], {type: 'text/csv'})
    saveAs(blob, 'data.csv')
  }

  render () {
    const {intl: {formatMessage}, openSettings} = this.props
    const name = formatMessage(messages.menu)
    return <div>
      <Tooltip title={name}>
        <IconButton
          aria-owns={this.state.open ? 'toolbar-menu' : null}
          aria-haspopup='true'
          onClick={this.handleClick}
          aria-label={name}>
          <MenuIcon color='white' />
        </IconButton>
      </Tooltip>
      <Menu
        open={this.state.open}
        MenuListProps={{dense: true}}
        id='toolbar-menu'
        anchorEl={this.state.anchorEl}
        onClick={this.handleRequestClose}
        onRequestClose={this.handleRequestClose}>
        <MenuItem onClick={() => openSettings('general')}>{formatMessage(messages.settings)}</MenuItem>
        <MenuItem onClick={this.handleExportGeoJSONClick}>{formatMessage(messages.exportGeoJSON)}</MenuItem>
        <MenuItem onClick={this.handleExportCSVClick}>{formatMessage(messages.exportCSV)}</MenuItem>
      </Menu>
    </div>
  }
}

MenuButton.propTypes = {
  features: MFPropTypes.features,
  intl: PropTypes.object.isRequired,
  openSettings: PropTypes.func.isRequired
}

export default injectIntl(MenuButton)
