# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2018-06-21

### Added

- Limit max map zoom when fitting to data - avoid zoom 22 when only one point is shown

### Fixed

- Update to latest material-ui and fix layout
- Make mapPosition a true controllable prop (previously only affected map position on initial render)
- Fix unfound images appearing in media view when photo was undefined for an observation

[1.0.0]: https://github.com/digidem/react-mapfilter/compare/v1.0.0...v1.1.0
