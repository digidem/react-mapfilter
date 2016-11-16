const React = require('react')
const { TransitionMotion, spring } = require('react-motion')
const Match = require('react-router/Match').default
const Link = require('react-router/Link').default

const springParameters = {
  overlay: {
    stiffness: 800,
    damping: 50
  },
  content: {
    stiffness: 800,
    damping: 35
  },
  leave: {
    stiffness: 500,
    damping: 40
  }
}

const willLeave = () => ({
  overlayOpacity: spring(0, springParameters.leave),
  size: spring(0.5, springParameters.leave),
  opacity: spring(0, springParameters.leave)
})

const willEnter = () => ({
  overlayOpacity: 0,
  size: 0.5,
  opacity: 0
})

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none'
  },
  overlayLink: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    cursor: 'default',
    pointerEvents: 'auto'
  },
  content: {
    position: 'static',
    flex: 1,
    border: 'none',
    background: 'none',
    overflow: 'visible',
    WebkitOverflowScrolling: 'touch',
    borderRadius: 0,
    outline: 'none',
    margin: 0,
    padding: 0,
    height: 'calc(100% - 80px)',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 640,
    pointerEvents: 'auto'
  }
}

const getOverlayStyle = style => ({
  ...styles.overlay,
  backgroundColor: `rgba(255, 255, 255, ${style.overlayOpacity})`
})

const getContentStyle = style => ({
  ...styles.content,
  transform: `scale(${style.size})`,
  opacity: style.opacity
})

const MatchModal = ({ render, component: Component, ...rest }) => (
  <Match {...rest} children={({ matched, ...props }) => {
    const closeLocation = matched && {
      ...props.location,
      pathname: '/' + props.params.section
    }
    return (
      <TransitionMotion
        willLeave={willLeave}
        willEnter={willEnter}
        styles={matched ? [ {
          key: props.location.pathname,
          style: {
            overlayOpacity: spring(0.95, springParameters.overlay),
            size: spring(1, springParameters.content),
            opacity: spring(1, springParameters.content)
          },
          data: props
        } ] : []}
      >
        {interpolatedStyles => (
          <div>
            {interpolatedStyles.map(config => (
              <div
                key={config.key}
                style={getOverlayStyle(config.style)}
              >
                {matched && <Link to={closeLocation} style={styles.overlayLink} />}
                <div style={getContentStyle(config.style)}>
                  {render ? render(config.data) : <Component {...config.data} />}
                </div>
              </div>
            ))}
          </div>
        )}
      </TransitionMotion>
    )
  }} />
)

module.exports = MatchModal
