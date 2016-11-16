const React = require('react')
const ReactDOM = require('react-dom')

const { connect } = require('react-redux')
const find = require('lodash/find')
// const { PropTypes } = React
const { Card, CardMedia, CardText, CardHeader } = require('material-ui/Card')
const {Table, TableBody, TableRow, TableRowColumn} = require('material-ui/Table')
const IconButton = require('material-ui/IconButton').default
const CloseIcon = require('material-ui/svg-icons/navigation/close').default

const getFlattenedFeatures = require('../selectors/flattened_features')
const getFieldMapping = require('../selectors/field_mapping')
const getColorIndex = require('../selectors/color_index')
const getVisibleFields = require('../selectors/visible_fields')
const MarkerIcon = require('./marker_icon')
const Image = require('./image')

const styles = {
  card: {
    width: '100%',
    maxHeight: '100%',
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
    position: 'absolute',
    objectFit: 'cover'
  },
  firstColumn: {
    fontWeight: 'bold'
  }
}

class FeatureDetail extends React.Component {
  state = {
    width: '50%'
  }

  componentDidMount () {
    this.autoFitColumn()
  }

  componentDidUpdate (prevProps) {
    if (this.props.data !== prevProps.data) {
      this.autoFitColumn()
    }
  }

  autoFitColumn () {
    let width = 0
    this.props.data.forEach(row => {
      var rowEl = ReactDOM.findDOMNode(this.refs[row.key])
      width = Math.max(width, rowEl.offsetWidth)
    })
    this.setState({
      width: width
    })
  }

  render () {
    const {color, media, data, title, subtitle, onCloseClick} = this.props
    return (
      <Card
        style={styles.card}
        containerStyle={styles.cardContainerStyle}
        zDepth={2}>
        <CardHeader
          style={styles.header}
          avatar={<MarkerIcon color={color} style={styles.markerIcon} />}
          title={title}
          subtitle={subtitle}>
          <IconButton style={{float: 'right'}} onClick={onCloseClick}>
            <CloseIcon />
          </IconButton>
        </CardHeader>
        <div style={styles.scrollable}>
          <CardMedia style={styles.media}>
            <Image style={styles.img} src={media} />
          </CardMedia>
          <CardText>
            <Table selectable={false}>
              <TableBody displayRowCheckbox={false} preScanRows={false}>
                {data.map((row, i) => {
                  return (
                    <TableRow key={row.key}>
                      <TableRowColumn ref={'__td' + i} style={{...styles.firstColumn, width: this.state.width}}>
                        <span ref={row.key}>{row.key}</span>
                      </TableRowColumn>
                      <TableRowColumn>{row.value.toString()}</TableRowColumn>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardText>
        </div>
      </Card>
    )
  }
}

module.exports = connect(
  (state, ownProps) => {
    const features = getFlattenedFeatures(state)
    const colorIndex = getColorIndex(state)
    const fieldMapping = getFieldMapping(state)
    const visibleFields = getVisibleFields(state)

    const feature = find(features, {id: ownProps.id})
    if (!feature) return
    const geojsonProps = feature.properties
    const data = visibleFields
      .filter(f => typeof geojsonProps[f] !== 'undefined')
      .map(f => ({key: f, value: geojsonProps[f]}))
    if (feature.geometry) {
      data.unshift({
        key: 'location',
        value: feature.geometry.coordinates
      })
    }
    return {
      data: data,
      media: geojsonProps[fieldMapping.media],
      title: geojsonProps[fieldMapping.title],
      subtitle: geojsonProps[fieldMapping.subtitle],
      color: colorIndex[geojsonProps[fieldMapping.color]]
    }
  }
)(FeatureDetail)
