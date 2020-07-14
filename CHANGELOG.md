# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.3](https://github.com/digidem/react-mapfilter/compare/v3.2.2...v3.2.3) (2020-07-14)


### Bug Fixes

* fix failing test for converting btween non-string values and labels ([79561db](https://github.com/digidem/react-mapfilter/commit/79561db2dc220e47d33ef2e6108720a51d93bdff))
* Fix number fields to always return number not string ([01968ca](https://github.com/digidem/react-mapfilter/commit/01968caffa58d9623d40a7a472a80e1a4044ea4a))
* Select should properly respect value/label objects for options ([60aeb28](https://github.com/digidem/react-mapfilter/commit/60aeb28ed73ab32653d8a3a60857d5ece2ad9af7))

### [3.2.2](https://github.com/digidem/react-mapfilter/compare/v3.2.1...v3.2.2) (2020-07-09)


### Bug Fixes

* Ensure TextField fallback has handleChange property ([801dfcd](https://github.com/digidem/react-mapfilter/commit/801dfcd6fc3bec3e5efa5919fac425695de3c2f1))
* SelectMultiple should not throw errors in console ([f5a219d](https://github.com/digidem/react-mapfilter/commit/f5a219d4ca7a74fb7608928f7564e9d8e982c1e7))

### [3.2.1](https://github.com/digidem/react-mapfilter/compare/v3.2.0...v3.2.1) (2020-07-09)


### Bug Fixes

* Don't automatically expand filters by default ([162722b](https://github.com/digidem/react-mapfilter/commit/162722bf2d77255d7a5eba6455d6e968dc4d3a9e))

## [3.2.0](https://github.com/digidem/react-mapfilter/compare/v3.1.0...v3.2.0) (2020-07-09)


### Features

* use @material-ui/lab/Autocomplete for SelectMultiple ([aced10d](https://github.com/digidem/react-mapfilter/commit/aced10da2724aaa5ea0d04122ccd7d8343fc3148))

## [3.1.0](https://github.com/digidem/react-mapfilter/compare/v3.0.0...v3.1.0) (2020-07-09)

### Features

- Support `localized` type fields ([9dba6f1](https://github.com/digidem/react-mapfilter/commit/9dba6f1d6b9a219d8ccaee04e348e6e615b61aca))
- Support `singleline` text fields ([67295b1](https://github.com/digidem/react-mapfilter/commit/67295b1422a0485de5072a274c8238d2f167df02))

## [3.0.0](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.15...v3.0.0) (2019-11-25)

### Bug Fixes

- Change label from "created" to "date of observation" ([607bcd0](https://github.com/digidem/react-mapfilter/commit/607bcd00bc1353e6d11a6989790f1c121879f91e))

## [3.0.0-beta.15](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.14...v3.0.0-beta.15) (2019-11-23)

### Bug Fixes

- Fix filter bug (can't return to show all) when filtering by two or more fields ([69a8aa3](https://github.com/digidem/react-mapfilter/commit/69a8aa3fa8bf206c852d7e740da7eb66c40b16c1))

## [3.0.0-beta.14](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.13...v3.0.0-beta.14) (2019-11-18)

### Bug Fixes

- Translate Delete Observation menu item ([9faeec9](https://github.com/digidem/react-mapfilter/commit/9faeec96b682b7028c68523cd46c0bccd993d461))

## [3.0.0-beta.13](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.12...v3.0.0-beta.13) (2019-11-12)

### Features

- Add read-only select_multiple field support ([0fc88e3](https://github.com/digidem/react-mapfilter/commit/0fc88e39fbd3fef1b78e62a7c367aeea18e8726c))

## [3.0.0-beta.12](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.11...v3.0.0-beta.12) (2019-10-31)

### Features

- Add delete observation action ([9688317](https://github.com/digidem/react-mapfilter/commit/9688317a1e415a70e73a2d453d4a41a5de0f9aff))

### Bug Fixes

- Remove unused IntlProvider in MapView ([fa5c45b](https://github.com/digidem/react-mapfilter/commit/fa5c45bc145ddb868ef8dc26dac98076bd0f1c67))

## [3.0.0-beta.11](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.10...v3.0.0-beta.11) (2019-10-08)

### Bug Fixes

- Hide fields button ([9659a36](https://github.com/digidem/react-mapfilter/commit/9659a36))

## [3.0.0-beta.10](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.9...v3.0.0-beta.10) (2019-10-08)

### Bug Fixes

- broken image color ([85005b3](https://github.com/digidem/react-mapfilter/commit/85005b3))
- don't move map if initialMapPosition is set ([526a5ef](https://github.com/digidem/react-mapfilter/commit/526a5ef))
- Don't show option to hide categoryId and notes from reports ([79d1fa4](https://github.com/digidem/react-mapfilter/commit/79d1fa4))
- Fix date filter not including max day ([dd52013](https://github.com/digidem/react-mapfilter/commit/dd52013))
- fix hiding fields in Report view ([24e3d44](https://github.com/digidem/react-mapfilter/commit/24e3d44))
- Fix report toolbar positioning ([0516d07](https://github.com/digidem/react-mapfilter/commit/0516d07))
- forward map ref ([005a454](https://github.com/digidem/react-mapfilter/commit/005a454))
- Min/max date always less than / greater than other ([1cc7a27](https://github.com/digidem/react-mapfilter/commit/1cc7a27))
- sort media (most recent first) ([3f999c1](https://github.com/digidem/react-mapfilter/commit/3f999c1))
- Sort presets by sort field, then by name ([d64312d](https://github.com/digidem/react-mapfilter/commit/d64312d))
- Support textarea fields (legacy support for iD presets) ([08e86c4](https://github.com/digidem/react-mapfilter/commit/08e86c4))
- Temp fix - allow wider field names in hidden fields dialog ([a7a6169](https://github.com/digidem/react-mapfilter/commit/a7a6169))
- Use @material-ui/core styles - fixes styling issues e.g. report printing ([1957010](https://github.com/digidem/react-mapfilter/commit/1957010))

### Features

- Don't show notes or categoryId in additional detail ([dba51e7](https://github.com/digidem/react-mapfilter/commit/dba51e7))

## [3.0.0-beta.9](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.8...v3.0.0-beta.9) (2019-10-06)

### Bug Fixes

- Don't show preset fields in "additional fields" ([9170100](https://github.com/digidem/react-mapfilter/commit/9170100))
- Report toolbar positioning ([eeb3691](https://github.com/digidem/react-mapfilter/commit/eeb3691))
- Support textarea fields (multi-line text fields) as well as just 'text' ([7febef4](https://github.com/digidem/react-mapfilter/commit/7febef4))

## [3.0.0-beta.8](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.7...v3.0.0-beta.8) (2019-10-06)

### Bug Fixes

- more hacky, more better ([e7a7df7](https://github.com/digidem/react-mapfilter/commit/e7a7df7))
- report layout with scrollbars ([cf3e204](https://github.com/digidem/react-mapfilter/commit/cf3e204))

### Features

- Add Spanish translations ([d69b68b](https://github.com/digidem/react-mapfilter/commit/d69b68b))
- build translations and include in npm publish ([496dda1](https://github.com/digidem/react-mapfilter/commit/496dda1))

## [3.0.0-beta.7](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.6...v3.0.0-beta.7) (2019-10-02)

### Bug Fixes

- Fix preset filtering ([5bdc42f](https://github.com/digidem/react-mapfilter/commit/5bdc42f))

## [3.0.0-beta.6](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.5...v3.0.0-beta.6) (2019-10-02)

### Bug Fixes

- Add key to JSX ([acdb464](https://github.com/digidem/react-mapfilter/commit/acdb464))
- Fix initial map position ([2e10386](https://github.com/digidem/react-mapfilter/commit/2e10386))
- Fix scroll in filter panel ([1e2e804](https://github.com/digidem/react-mapfilter/commit/1e2e804))
- remove fsevents dep ([82db532](https://github.com/digidem/react-mapfilter/commit/82db532))

## [3.0.0-beta.5](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.4...v3.0.0-beta.5) (2019-10-02)

### Bug Fixes

- Fix print view crash on print ([a35eb84](https://github.com/digidem/react-mapfilter/commit/a35eb84))
- remove shadow on toolbar ([9c2dc1c](https://github.com/digidem/react-mapfilter/commit/9c2dc1c))

## [3.0.0-beta.4](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.2...v3.0.0-beta.4) (2019-10-02)

### Bug Fixes

- remove paper styling for filter pane ([fd25320](https://github.com/digidem/react-mapfilter/commit/fd25320))

## [3.0.0-beta.3](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2019-10-02)

## [3.0.0-beta.2](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2019-10-02)

### Bug Fixes

- wrap filterpanel with picker utils ([87727d6](https://github.com/digidem/react-mapfilter/commit/87727d6))

## [3.0.0-beta.1](https://github.com/digidem/react-mapfilter/compare/v3.0.0-beta.0...v3.0.0-beta.1) (2019-10-02)

### Bug Fixes

- Don't inject map css ([fc606a1](https://github.com/digidem/react-mapfilter/commit/fc606a1))
- Export FilterPanel ([22a0adc](https://github.com/digidem/react-mapfilter/commit/22a0adc))
