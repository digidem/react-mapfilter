const React = require('react')
const { TransitionMotion, spring } = require('react-motion')
const Match = require('react-router/Match').default
const Link = require('react-router/Link').default
const assign = require('object-assign')
const omit = require('lodash/omit')

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
    pointerEvents: 'auto',
    left: 0
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

const getOverlayLinkStyle = style => assign({}, styles.overlayLink, {
  backgroundColor: `rgba(255, 255, 255, ${style.overlayOpacity})`
})

const getContentStyle = style => assign({}, styles.content, {
  transform: `scale(${style.size})`,
  opacity: style.opacity
})

const MatchModal = props => {
  const { render, component: Component } = props
  const rest = omit(props, ['render', 'component'])
  return <Match {...rest} children={props => {
    const {matched, location, params} = props
    const closeLocation = matched && assign({}, location, {
      pathname: '/' + params.section
    })
    return (
      <TransitionMotion
        willLeave={willLeave}
        willEnter={willEnter}
        styles={matched ? [ {
          key: location.pathname,
          style: {
            overlayOpacity: spring(0.8, springParameters.overlay),
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
                style={styles.overlay}
              >
                {matched && <Link to={closeLocation} style={getOverlayLinkStyle(config.style)} />}
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
}

module.exports = MatchModal
