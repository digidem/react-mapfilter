// @flow
import * as React from 'react'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '../utils/styles'
import { FormattedTime, FormattedMessage } from 'react-intl'

import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import PlaceIcon from '@material-ui/icons/Place'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import FormattedLocation from '../internal/FormattedLocation'
import msgs from '../messages'
import type { Coordinates } from '../types'

const useStyles = makeStyles({
  avatar: {
    width: 50,
    height: 50,
    fontSize: 24,
    fontWeight: 500
  },
  action: {
    alignSelf: 'center',
    margin: 0
  }
})

type Props = {
  iconLabel?: string,
  iconColor?: string,
  name?: React.Node,
  coords?: Coordinates,
  createdAt?: Date,
  onClose?: () => any
}

const FeatureHeader = ({
  iconLabel,
  iconColor = '#cccccc',
  name,
  coords,
  createdAt,
  onClose
}: Props) => {
  const classes = useStyles()
  const subheaderParts = []
  if (createdAt)
    subheaderParts.push(
      <FormattedTime
        value={createdAt}
        year="numeric"
        month="long"
        day="2-digit"
      />
    )
  if (coords) {
    if (subheaderParts.length) subheaderParts.push(' \u2014 ')
    subheaderParts.push(<FormattedLocation {...coords} />)
  }

  return (
    <CardHeader
      classes={{ action: classes.action }}
      avatar={
        <Avatar
          aria-label="Recipe"
          style={{ backgroundColor: iconColor }}
          className={classes.avatar}>
          {iconLabel || <PlaceIcon fontSize="large" />}
        </Avatar>
      }
      action={
        onClose && (
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )
      }
      title={
        <Typography variant="h5" component="h2">
          {name || <FormattedMessage {...msgs.defaultObservationName} />}
        </Typography>
      }
      subheader={subheaderParts}
    />
  )
}

export default FeatureHeader
