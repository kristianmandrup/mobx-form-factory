import {FormFactoryContext} from './FormFactory';
import * as React from 'react';
import {Observer, observer} from 'mobx-react';
import filterReactProps from 'filter-react-props';
import {toJS, isObservable} from 'mobx';

@observer
export default class FieldFactory extends React.Component < any,
any > {
  render() {
    return (
      <FormFactoryContext.Consumer>
        {model => {
          if (!model) {
            return null;
          }
          return (
            <Observer>
              {() => {
                const {
                  type,
                  name,
                  value,
                  component = 'input',
                  render
                } = this.props;
                return React.createElement(component, {
                  // ...finalProps
                });
              }}
            </Observer>
          );
        }}
      </FormFactoryContext.Consumer>
    );
  }
}
