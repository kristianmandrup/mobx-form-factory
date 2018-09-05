import {observer} from 'mobx-react';
import * as React from 'react';
import FormModelFactory from './FormModelFactory';
import {isFunction} from 'lodash';
import {observable} from 'mobx';
export const FormFactoryContext = React.createContext < FormModelFactory | null | undefined > (null);

export interface FormFactoryProps {
  modelConstructor?: any;
  initialValues?: any;
  model?: FormModelFactory;
  onSubmitSuccess
    ?;
  onSubmitError
    ?;
}

@observer
export default class FormFactory extends React.Component < FormFactoryProps,
any > {
  render() {
    const {children} = this.props;
    const {model} = this;
    return ();
  }
