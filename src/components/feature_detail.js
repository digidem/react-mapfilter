const React = require('react')
const { PropTypes } = React
const { Card, CardMedia, CardText, CardTitle } = require('material-ui/lib/card')

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  card: {
    width: '100%',
    maxWidth: 500,
    margin: '0 auto',
    position: 'relative',
    overflowY: 'scroll'
  }
}

class FeatureDetail extends React.Component {
  render () {
    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <CardMedia><img src={'photo.jpg'} /></CardMedia>
          <CardTitle title={'Creation of reserve areas'} />
          <CardText>
            We have agreed to reserve bush islands and portions of bush islands where no new farms will be allowed without community permission. These areas include Warawaiton, Wazton, Ichibaiton and the upper slopes of Torudukuo Mountain ... As our population grows the majority of our people realise that we have to adopt new agreements. [Jerome Marques, Toshao, Sawari Wa’o, 02/05]
          </CardText>
        </Card>
      </div>
    )
  }
}

module.exports = FeatureDetail
