MapFilter
=========

MapFilter is a tool for visualizing, exploring, filtering and printing geographic data and geotagged photos and video. It is used by Digital Democracy partners for community environmental monitoring: it allows users to explore the data they have collected and easily create reports of specific time periods or particular issues.

MapFilter expects GeoJSON as input, but is otherwise data agnostic. It will analyze the properties of a GeoJSON file and make a guess at field types and suggest fields to filter. It currently allows for filtering by date range on any date fields, and filtering by discrete fields that have fewer than 15 different values in the dataset.

Data can be visualized as a map, a grid of photos, or a report layout. In the future we plan to add a table view and potentially a graph view.

The goal is to be simple and easy to use. Our partners want to be able to easily access and explore the data they have collected.

Demo
----

You can see a demo of the current version of MapFilter here: http://mapfilter.ddem.us

Version 2 is under active development and demo is available here: https://story-teller-cloud-12717.netlify.com

Installation
------------

Clone this repository locally:

```sh
git clone https://github.com/digidem/mapfilter.git
cd mapfilter
```

Then install dependencies and start the development server:

```sh
npm install
npm start
```

You can then open [http://localhost:9966/](http://localhost:9966/) in a browser.

Offline Preparation
-------------------

Re-create static map assets (these are checked into git at the moment):

```sh
bin/build_style.js example/map_style
```

Architecture and how to contribute
----------------------------------

See [`CONTRIBUTING.md`](./CONTRIBUTING.md)
