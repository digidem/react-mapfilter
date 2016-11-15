const React = require('react')
const Link = require('react-router/Link').default
const AppBar = require('material-ui/AppBar').default

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
    color: 'rgba(255, 255, 255, 0.701961)',
    textDecoration: 'none',
    textTransform: 'uppercase',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box'
  },
  activeTab: {
    color: 'rgba(255, 255, 255, 1)',
    borderBottom: '2px solid rgb(255, 64, 129)',
    paddingTop: 2
  },
  right: {
    flex: 1
  }
}

function TopBar ({currentSection, tabs}) {
  return (
    <AppBar
      title='MapFilter'
      style={styles.topBar}
      titleStyle={styles.title}
      showMenuIconButton={false}>
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <Link to={tab.link} style={styles.tab} activeStyle={styles.activeTab}>
            {tab.title}
          </Link>
        ))}
      </div>
      <div style={styles.right} />
    </AppBar>
  )
}

module.exports = TopBar
