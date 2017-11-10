import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Card, { CardHeader } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import ButtonBase from 'material-ui/ButtonBase'
import CloseIcon from 'material-ui-icons/Close'
import { withStyles } from 'material-ui/styles'
import {defineMessages, FormattedMessage} from 'react-intl'
import classNames from 'classnames'

import { openSettings } from '../../action_creators'
import FilterConfigurator from './filter_configurator'
import GeneralSettings from './general'

const styles = {
  card: {
    maxHeight: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  title: {
    borderBottom: '1px solid #e0e0e0',
    boxSizing: 'border-box',
    padding: '1em',
    position: 'relative'
  },
  tabList: {
    borderRight: '1px solid #e0e0e0',
    flex: 1
  },
  tab: {
    justifyContent: 'left',
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 13,
    height: 48,
    width: '100%'
  },
  tabActive: {
    backgroundColor: 'rgba(0,0,0,.05)',
    fontWeight: 'bold'
  },
  body: {
    display: 'flex'
  },
  content: {
    flex: 3,
    padding: 16
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
    right: 7,
    zIndex: 1
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
  id: 'filters',
  component: FilterConfigurator
}, {
  id: 'general',
  component: GeneralSettings
}]

const Tab = ({active, label, onClick, classes}) => (
  <ButtonBase
    disableRipple
    className={classNames(classes.tab, {[classes.tabActive]: active})}
    onClick={onClick}>
    {label}
  </ButtonBase>
)

class Settings extends React.Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    onChangeTab: PropTypes.func.isRequired,
    activeTabId: PropTypes.string
  }

  render () {
    const { onRequestClose, activeTabId, onChangeTab, classes, className } = this.props
    const tabIndex = getTabIndex(activeTabId)
    const TabComponent = tabs[tabIndex].component
    return (
      <Card className={classNames(classes.card, className)}>
        <IconButton className={classes.icon} onClick={onRequestClose}>
          <CloseIcon />
        </IconButton>
        <CardHeader
          className={classes.title}
          title={<FormattedMessage {...messages.settingsTitle} />} />
        <div className={classes.body}>
          <div className={classes.tabList}>
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={<FormattedMessage {...messages[tab.id]} />}
                active={i === tabIndex}
                classes={classes}
                onClick={onChangeTab.bind(null, tab.id)} />
            ))}
          </div>
          <div className={classes.content}>
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

export default compose(
  connect(state => state, mapDispatchToProps),
  withStyles(styles)
)(Settings)
