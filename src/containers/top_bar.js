import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import {defineMessages, FormattedMessage} from 'react-intl'
import assign from 'object-assign'

import CustomContainer from './custom_container'
import {SettingsButton, PrintButton} from '../components/buttons'

const styleSheet = {
  topBar: {
    height: 56
  },
  title: {
    height: 56,
    lineHeight: '56px'
  },
  tabs: {
    flex: 1,
    maxWidth: 300,
    display: 'flex'
  },
  tab: {
    display: 'flex',
    flex: 1,
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.701961)',
    textDecoration: 'none',
    textTransform: 'uppercase',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer'
  },
  activeTab: {
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: 500,
    borderBottom: '2px solid rgb(255, 64, 129)',
    paddingTop: 2
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
}

const messages = defineMessages({
  map: {
    id: 'topbar.map',
    defaultMessage: 'Map',
    description: 'Map tab name'
  },
  media: {
    id: 'topbar.media',
    defaultMessage: 'Media',
    description: 'Media tab name'
  },
  report: {
    id: 'topbar.report',
    defaultMessage: 'Report',
    description: 'Report tab name'
  }
})

function TopBar ({activeView, views, onChangeTab, buttons, title, classes}) {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography type='title' color='inherit'>{title}</Typography>
        <div className={classes.tabs}>
          {views.map(view => {
            var className = view.id === activeView ? classes.tab + ' ' + classes.activeTab : classes.tab
            return <a key={view.id} className={className} onClick={onChangeTab.bind(null, view.id)}>
              <FormattedMessage {...messages[view.id]} />
            </a>
          })}
        </div>
        <div className={classes.right}>
          {buttons.map((button, i) => <CustomContainer key={i} component={button} />)}
        </div>
      </Toolbar>
    </AppBar>
  )
}

TopBar.defaultProps = {
  buttons: [
    PrintButton,
    SettingsButton
  ],
  title: 'MapFilter'
}

TopBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
}

export default withStyles(styleSheet)(TopBar)
