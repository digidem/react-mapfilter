const React = require('react')

const { Card, CardMedia, CardText, CardHeader } = require('material-ui/Card')

const styles = {
  card: {
    width: '100%',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    display: 'flex'
  },
  header: {
    lineHeight: '22px',
    boxSizing: 'content-box',
    borderBottom: '1px solid #cccccc'
  },
  markerIcon: {
    width: 40,
    height: 40,
    margin: 0,
    marginRight: 16
  },
  scrollable: {
    flex: 1,
    overflow: 'auto'
  },
  media: {
    position: 'relative',
    height: 0,
    padding: '67% 0 0 0'
  },
  img: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    objectFit: 'cover'
  }
}

const Report = ({color, media, data, title, subtitle, onCloseClick}) => (
  <Card
    style={styles.card}
    containerStyle={styles.cardContainerStyle}
    zDepth={2}>
    <CardHeader
      style={styles.header}
      avatar={<MarkerIcon color={color} style={styles.markerIcon} />}
      title={<FormattedMessage {...msg('field_value')(title)} />}
      subtitle={<FormattedMessage {...msg('field_value')(subtitle)} />}>
      <IconButton style={{float: 'right'}} onClick={onCloseClick}>
        <CloseIcon />
      </IconButton>
    </CardHeader>
    <div style={styles.scrollable}>
      <CardMedia style={styles.media}>
        <Image style={styles.img} src={media} />
      </CardMedia>
      <CardText>
        <FeatureTable data={data} />
      </CardText>
    </div>
  </Card>
)

module.exports = Report
