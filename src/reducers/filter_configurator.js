const filterConfigurator = (state = false, {type}) => {
  switch (type) {
    case 'OPEN_FILTER_CONFIGURATOR':
      return true

    case 'CLOSE_FILTER_CONFIGURATOR':
      return false

    default:
      return state
  }
}

module.exports = filterConfigurator
