import {observer} from 'mobx-react';
import * as React from 'react';
import {ModelForm, FormViewModel} from '@hrgui/mobx-form-model'
import {default as FormViewModelFactory} from './FormViewModelFactory'
import {default as FieldFactory} from './FieldFactory'
export const FormFactoryContext = React.createContext < FormViewModelFactory | null | undefined > (null);

export interface FormFactoryProps {
  modelConstructor?: any;
  initialValues?: any;
  model?: FormViewModel;
  formSchema : any,
  onSubmitSuccess
    ?;
  onSubmitError
    ?;
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
  export default class FormFactory extends React.Component < FormFactoryProps,
  any > {
    render() {
      const {model, formSchema} = this.props;
      return (
        <ModelForm model={model}>
          <Fields formSchema={formSchema}/>
        </ModelForm>
      )
    }
  }
