const React = require('react')
const AppBar = require('material-ui/AppBar').default
const {defineMessages, FormattedMessage} = require('react-intl')
const assign = require('object-assign')

const styles = {
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
    flex: 1
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

function TopBar ({activeView, views, onChangeTab}) {
  return (
    <AppBar
      className='nav container'
      title='MapFilter'
      style={styles.topBar}
      titleStyle={styles.title}
      showMenuIconButton={false}>
      <div style={styles.tabs}>
        {views.map(view => {
          var tabStyle = view.id === activeView ? assign({}, styles.tab, styles.activeTab) : styles.tab
          return <a key={view.id} style={tabStyle} onClick={onChangeTab.bind(null, view.id)}>
            <FormattedMessage {...messages[view.id]} />
          </a>
        })}
      </div>
      <div style={styles.right} />
    </AppBar>
  )
}

module.exports = TopBar
