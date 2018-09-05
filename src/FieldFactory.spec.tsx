import * as React from 'react';
import * as renderer from 'react-test-renderer';
import FieldFactory from './FieldFactory';
import FormFactory from './FormFactory';
import FormModelFactory from './FormViewModelFactory';

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

const formSchema = forms.person

describe('FieldFactory', () => {
  it('should render null w/o ModelForm', () => {
    const tree = renderer
      .create(<FieldFactory/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('Field <=> ModelForm', () => {
    it('should render basic types easily (text, number, radio)', () => {
      const modelBuilder = new FormModelFactory();
      const viewModel = modelBuilder.build()
      const tree = renderer
        .create(<FormFactory model={viewModel} formSchema={formSchema}/>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render basic types easily with a custom type in addition', () => {
      const modelBuilder = new FormModelFactory();
      const viewModel = modelBuilder.build()
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
      const modelBuilder = new FormModelFactory();
      const viewModel = modelBuilder.build()
      const tree = renderer
        .create(
        <FormFactory model={viewModel} formSchema={formSchema}></FormFactory>
      )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
