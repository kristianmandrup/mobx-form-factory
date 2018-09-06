import {observer} from 'mobx-react';
import * as React from 'react';
import {ReactNode} from 'react';
import {ModelForm} from '@hrgui/mobx-form-model'
import {FormViewModelFactory, XFormViewModel} from './FormViewModelFactory'
import {FormFields} from './FormFields'

export const FormFactoryContext = React.createContext < FormViewModelFactory | null | undefined > (null);

export interface AutoFormProps {
  model : XFormViewModel;
  children : {
    header?: ReactNode,
    fields?: ReactNode,
    actions?: ReactNode
  }
}

@observer
export class AutoForm extends React.Component < AutoFormProps > {
  render() {
    const {model, children} = this.props;
    const {header, fields, actions} = children
    return <ModelForm model={model}>
      {header
        ? header
        : null}
      {fields
        ? fields
        : this.renderFields(model)}
      {actions
        ? actions
        : null}
    </ModelForm>
  }

  renderFields(model : XFormViewModel) {
    return <FormFields model={model}/>
  }
}
