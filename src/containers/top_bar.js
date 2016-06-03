const React = require('react')
const { Tabs, Tab } = require('material-ui/Tabs')
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
    maxWidth: 300
  },
  tab: {
    height: 56
  },
  right: {
    flex: 1
  }
}

function TopBar ({currentSection, onChange}) {
  return (
    <AppBar
      title='MapFilter'
      style={styles.topBar}
      titleStyle={styles.title}
      showMenuIconButton={false}>
      <Tabs
        value={currentSection}
        onChange={onChange}
        style={styles.tabs}
      >
        <Tab label='Map' value='map' style={styles.tab} />
        <Tab label='Photos' value='photos' style={styles.tab} />
        <Tab label='Report' value='report' style={styles.tab} />
      </Tabs>
      <div style={styles.right} />
    </AppBar>
  )
}

module.exports = TopBar
