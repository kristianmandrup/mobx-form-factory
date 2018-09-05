import {FormFactoryContext} from './FormFactory';
import {XFormViewModel} from './FormViewModelFactory'
import * as React from 'react';
import {observer} from 'mobx-react';
import {Field} from '@hrgui/mobx-form-model'

// TODO: Allow override
const defaults = {
  typeComponentMap: {
    string: 'text',
    array: 'select',
    date: 'date',
    boolean: 'radio'
  }
};

export interface FormFactoryProps {
  modelConstructor?: any;
  initialValues?: any;
  model?: XFormViewModel;
  onSubmitSuccess
    ?;
  onSubmitError
    ?;
};

@observer
export class FieldFactory extends React.Component < any,
any > {
  render() {
    return (
      <FormFactoryContext.Consumer>
        {model => {
          if (!model) {
            return null;
          }
          const {inputs, typeComponentMap} = model
          const {type, name} = this.props

          if (type === 'object') {
            // TODO: nested form
          }

          const $typeComponentMap = typeComponentMap || defaults.typeComponentMap

          const componentName = $typeComponentMap[type]
          const component = inputs.named[name] || inputs.generic[componentName]

          return (<Field {...this.props} component={component}/>)
        }}
      </FormFactoryContext.Consumer>
    );
  }
}
