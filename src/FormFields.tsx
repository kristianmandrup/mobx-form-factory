import * as React from 'react';
import {FieldFactory} from './FieldFactory'

export interface FieldsProps {
  model?: any
  formSchema?: any;
}

export const FormFields = (props : FieldsProps) => {
  const {model} = props
  const formSchema = props.formSchema || (model && model.formSchema);
  return formSchema
    .fieldNames
    .map((name, index) => (<FieldFactory field={formSchema.fields[name]}/>))
}
