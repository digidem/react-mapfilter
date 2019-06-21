import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'

import HideFieldsButton from './HideFieldsButton'
import { FieldnameTranslationProvider } from '../Providers'

const fieldState = {
  foo: 'visible',
  bar: 'hidden',
  qux: 'visible'
}

const translations = {
  foo: 'Foo field',
  bar: 'Bar field',
  qux: 'Really long fieldname to test wrapping'
}

class HideFieldsState extends React.Component<typeof fieldState> {
  state = fieldState
  render() {
    return this.props.children({
      fieldState: this.state,
      toggleFieldVisibility: fieldkey =>
        this.setState({
          [fieldkey]: this.state[fieldkey] === 'hidden' ? 'visible' : 'hidden'
        }),
      showAllFields: () =>
        this.setState({ foo: 'visible', bar: 'visible', qux: 'visible' }),
      hideAllFields: () =>
        this.setState({ foo: 'hidden', bar: 'hidden', qux: 'hidden' })
    })
  }
}

storiesOf('ReportView/HideFieldsButton', module)
  .add('default', () => (
    <HideFieldsButton
      fieldState={fieldState}
      toggleFieldVisibility={action('toggle-field')}
      showAllFields={action('show-all')}
      hideAllFields={action('hide-all')}
    />
  ))
  .add('with translation', () => (
    <FieldnameTranslationProvider
      value={{ fieldnameTranslations: translations }}>
      <HideFieldsButton
        fieldState={fieldState}
        toggleFieldVisibility={action('toggle-field')}
        showAllFields={action('show-all')}
        hideAllFields={action('hide-all')}
      />
    </FieldnameTranslationProvider>
  ))
  .add('with state', () => (
    <HideFieldsState>
      {({
        fieldState,
        toggleFieldVisibility,
        showAllFields,
        hideAllFields
      }) => (
        <HideFieldsButton
          fieldState={fieldState}
          toggleFieldVisibility={toggleFieldVisibility}
          showAllFields={showAllFields}
          hideAllFields={hideAllFields}
        />
      )}
    </HideFieldsState>
  ))
