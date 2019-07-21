import { makeStyles as makeStylesWithoutDefault } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

export const defaultTheme = createMuiTheme()

/**
 * Creates a default theme so that you don't need to use a ThemeProvider to use
 * these components, but you can override the default theme with a ThemeProvider
 */
export function makeStyles(stylesOrCreator, options) {
  return makeStylesWithoutDefault(stylesOrCreator, {
    defaultTheme,
    ...options
  })
}
