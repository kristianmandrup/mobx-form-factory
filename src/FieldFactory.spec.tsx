import * as React from 'react';
import * as renderer from 'react-test-renderer';
import {FieldFactory} from './FieldFactory';
import {FormFactory} from './FormFactory';
import {FormViewModelFactory} from './FormViewModelFactory';

const forms = {
  person: {
    firstName: {
      input: "name"
    },
    lastName: {
      input: "name"
    },
    age: {
      input: "number"
    },
    roles: {
      input: "multiSelect"
    }
  }
  // ...
};

const config = {
  // TODO
}

function createModelBuilder(formSchema : any) {
  return new FormViewModelFactory(formSchema)
}

function createViewModel(formSchema : any, config?: any) {
  return new FormViewModelFactory(formSchema).build(config)
}

const formSchema = forms.person;
describe('FieldFactory', () => {
  it('should render null w/o ModelForm', () => {
    const tree = renderer
      .create(<FieldFactory/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('Field <=> ModelForm', () => {
    it('should render basic types easily (text, number, radio)', () => {
      const viewModel = createViewModel(config);
      const tree = renderer
        .create(<FormFactory model={viewModel}/>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render basic types easily with a custom type in addition', () => {
      const viewModel = createViewModel(config);
      viewModel.setField('name', {value: 'Mickey Mouse'});
      viewModel.setFields({
        age: {
          value: 100
        },
        gender: {
          value: 'male'
        },
        isCartoon: {
          value: true
        }
      });
      const tree = renderer
        .create(<FormFactory model={viewModel} formSchema={formSchema}/>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should support fields built via custom builder', () => {
      const viewModel = createViewModel(config);
      const tree = renderer
        .create(
        <FormFactory model={viewModel} formSchema={formSchema}></FormFactory>
      )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
