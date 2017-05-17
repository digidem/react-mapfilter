import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Card } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
import {defineMessages, FormattedMessage} from 'react-intl'

import { openSettings } from '../../action_creators'
import FilterConfigurator from './filter_configurator'
import GeneralSettings from './general'

const styles = {
  card: {
    maxHeight: '100%',
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    borderBottom: '1px solid #e0e0e0',
    boxSizing: 'border-box',
    color: '#212121',
    margin: 0,
    fontWeight: 'normal',
    padding: '1em',
    position: 'relative'
  },
  tabList: {
    borderRight: '1px solid #e0e0e0',
    flex: 1
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: 'normal'
  },
  tabLabelActive: {
    textTransform: 'none',
    fontWeight: 'bold'
  },
  tab: {
    textAlign: 'left',
    height: 48,
    lineHeight: '48px'
  },
  tabActive: {
    textAlign: 'left',
    height: 48,
    lineHeight: '48px',
    backgroundColor: 'rgba(0,0,0,.05)'
  },
  body: {
    display: 'flex'
  },
  content: {
    flex: 3
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  icon: {
    position: 'absolute',
    top: 7,
    right: 7
  },
  scrollable: {
    overflow: 'auto'
  }
}

const messages = defineMessages({
  settingsTitle: {
    id: 'settings.title',
    defaultMessage: 'Settings',
    description: 'Title text for settings dialog'
  },
  filters: {
    id: 'settings.filters',
    defaultMessage: 'Change Filters',
    description: 'Tab label for filter settings pane'
  },
  fields: {
    id: 'settings.fields',
    defaultMessage: 'Visible Fields',
    description: 'Tab label for fields settings pane'
  },
  general: {
    id: 'settings.general',
    defaultMessage: 'General',
    description: 'Tab label for general settings pane'
  }
})

const tabs = [{
  id: 'general',
  component: GeneralSettings
}, {
  id: 'filters',
  component: FilterConfigurator
}]

const Tab = ({active, label, onClick}) => (
  <FlatButton
    fullWidth
    label={label}
    style={active ? styles.tabActive : styles.tab}
    labelStyle={active ? styles.tabLabelActive : styles.tabLabel}
    onTouchTap={onClick} />
)

class Settings extends React.Component {
  static propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    activeTabId: PropTypes.string
  }

  render () {
    const { onCloseClick, activeTabId, onChangeTab } = this.props
    const tabIndex = getTabIndex(activeTabId)
    const TabComponent = tabs[tabIndex].component
    return (
      <Card
        style={styles.card}
        containerStyle={styles.cardContainerStyle}
        zDepth={2}>
        <h3 style={styles.title}>
          <FormattedMessage {...messages.settingsTitle} />
          <IconButton style={styles.icon} onTouchTap={onCloseClick}>
            <CloseIcon />
          </IconButton>
        </h3>
        <div style={styles.body}>
          <div style={styles.tabList}>
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={<FormattedMessage {...messages[tab.id]} />}
                active={i === tabIndex}
                onClick={onChangeTab.bind(null, tab.id)} />
            ))}
          </div>
          <div style={styles.content}>
            <TabComponent />
          </div>
        </div>
      </Card>
    )
  }
}

function getTabIndex (tabId) {
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].id === tabId) return i
  }
  return 0
}

function mapDispatchToProps (dispatch) {
  return {
    onChangeTab: (settingsTab) => dispatch(openSettings(settingsTab))
  }
}

export default connect(
  state => state,
  mapDispatchToProps
)(Settings)
