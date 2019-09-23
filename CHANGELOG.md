# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/digidem/react-mapfilter/compare/v1.3.1...v2.0.0) (2019-09-23)


### Bug Fixes

* Add key to react children ([f9bb39d](https://github.com/digidem/react-mapfilter/commit/f9bb39d))


### Features

* Update react-intl to v3 ([ded3a2e](https://github.com/digidem/react-mapfilter/commit/ded3a2e))


### BREAKING CHANGES

* Update react-intl to v3, which uses React.context
internally, which means that if you use react-intl higher up the
component tree you need to update it there too



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
