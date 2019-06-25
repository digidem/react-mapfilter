import { makeStyles as makeStylesWithoutDefault } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

export const defaultTheme = createMuiTheme()

export function makeStyles(stylesOrCreator, options) {
  return makeStylesWithoutDefault(stylesOrCreator, {
    defaultTheme,
    ...options
  })
}
