# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.1](https://github.com/digidem/react-mapfilter/compare/v1.3.0...v1.3.1) (2019-06-02)


### Bug Fixes

* **FeatureDetail:** Fix feature details not showing because missing formatLocation ([745225c](https://github.com/digidem/react-mapfilter/commit/745225c))
* **filter pane:** fix filter pane not scrolling when many filters ([e32784b](https://github.com/digidem/react-mapfilter/commit/e32784b))
* **filters:** Show filters even for fields with many different values (100s) ([377cc78](https://github.com/digidem/react-mapfilter/commit/377cc78))
* **filters:** stop date filters disappearing if one observation has no date ([e1a4491](https://github.com/digidem/react-mapfilter/commit/e1a4491))
* **media view:** pin react-virtualized to 9.21.0 to avoid breaking change in 9.21.1 ([bd5f6c9](https://github.com/digidem/react-mapfilter/commit/bd5f6c9))



## [1.1.0] - 2018-06-21

### Added

- Limit max map zoom when fitting to data - avoid zoom 22 when only one point is shown

### Fixed

- Update to latest material-ui and fix layout
- Make mapPosition a true controllable prop (previously only affected map position on initial render)
- Fix unfound images appearing in media view when photo was undefined for an observation

[1.0.0]: https://github.com/digidem/react-mapfilter/compare/v1.0.0...v1.1.0
