# MapFilter

MapFilter is a tool for visualizing, exploring, filtering and printing geographic data and geotagged photos and video. It is used by Digital Democracy partners for community environmental monitoring: it allows users to explore the data they have collected and easily create reports of specific time periods or particular issues.

MapFilter expects GeoJSON as input, but is otherwise data agnostic. It will analyze the properties of a GeoJSON file and make a guess at field types and suggest fields to filter. It currently allows for filtering by date range on any date fields, and filtering by discrete fields that have 15 or fewer different values in the dataset.

Data can be visualized as a map, a grid of photos, or a report layout. Additional views can be added via plugins.

The goal is to be simple and easy to use. Our partners want to be able to easily access and explore the data they have collected.

## Installation

Using [npm](https://www.npmjs.com/):

```shell
npm install --save react-mapfilter
```

To use directly in the browser without a module bundler, the UMD build is also available on [unpkg](https://unpkg.com) (add this code to the `<head>` of your HTML doc and you wind find the library on `window.MapFilter`:

```html
<script src="https://unpkg.com/react-mapfilter/dist/react-mapfilter.js"></script>
```

## Basic Usage

`MapFilter` is a [React](https://facebook.github.io/react/) component. If you are using a module bundler like [browserify](http://browserify.org/) or [webpack](https://webpack.github.io/):

```js
var MapFilter = require('react-mapfilter').default
```

```js
// if you are using an ES6 transpiler, like babel
import MapFilter from 'react-mapfilter'

const features = {
  features: [{
    geometry: {
      coordinates: [-59.9802, 2.8772],
      type: 'Point'
    },
    properties: {
      name: 'Point one'
    }
  }, {
    geometry: {
      coordinates: [-59.9524, 2.4969],
      type: 'Point'
    },
    properties: {
      name: 'Point two'
    }
  }]
}

class Example extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      features: features
    }
  }

  handleChangeFeatures = (_) => {
    this.setState({features: _})
  }

  render () {
    return <MapFilter
      features={this.state.features}
      onChangeFeatures={this.handleChangeFeatures} />
  }
}
```



## Demo

You can see a demo of the pre-release version of MapFilter here: http://mapfilter.ddem.us

## Installation

Clone this repository locally:

```sh
git clone https://github.com/digidem/react-mapfilter.git
cd react-mapfilter
```

Then install dependencies and start the development server:

```sh
npm install
npm start
```

You can then open [http://localhost:9966/](http://localhost:9966/) in a browser.

## API



## Offline Preparation

Re-create static map assets (these are checked into git at the moment):

```sh
bin/build_style.js example/map_style
```

## Architecture and how to contribute

See [`CONTRIBUTING.md`](./CONTRIBUTING.md)
