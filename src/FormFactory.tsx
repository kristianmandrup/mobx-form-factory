import {observer} from 'mobx-react';
import * as React from 'react';
import {ModelForm} from '@hrgui/mobx-form-model'
import {FormViewModelFactory, XFormViewModel} from './FormViewModelFactory'
import {FieldFactory} from './FieldFactory'

export const FormFactoryContext = React.createContext < FormViewModelFactory | null | undefined > (null);

export interface FormFactoryProps {
  modelConstructor?: any;
  initialValues?: any;
  model : XFormViewModel;
  formSchema?: any;
  onSubmitSuccess?: any;
  onSubmitError?: any;
}

export interface FieldsProps {
  formSchema?: any;
}

const Fields = (props : FieldsProps) => {
    const {formSchema} = props;
    return formSchema
      .fieldNames
      .map((name, index) => (<FieldFactory field={formSchema.fields[name]}/>))
  }

  @observer
  export class FormFactory extends React.Component < FormFactoryProps,
  any > {
    render() {
      const {model, formSchema} = this.props;
      const $formSchema = formSchema || model.formSchema
      return (
        <ModelForm model={model}>
          <Fields formSchema={$formSchema}/>
        </ModelForm>
      )
    }
  }
