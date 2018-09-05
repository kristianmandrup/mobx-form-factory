import * as React from 'react';
import {shallow} from 'enzyme';
import {default as FormFactory} from './FormFactory';
import {default as FormViewModelFactory} from './FormViewModelFactory';
import {wait} from './testUtils';
import {FormViewModel} from '@hrgui/mobx-form-model'

function createFormModel() {
  return new FormViewModelFactory().build()
}

const schemas = {
  person: require("./schemas/person.json")
  // ...
};

const inputs : any = {};

inputs.generic = {
  single: {
    // select: (props : any) => <select/>
  },
  multi: {
    // select: (props : any) => <MultiSelect ...props/>, checkbox : (props : any) =>
    // <Checkboxes ...props/>
  }
}

inputs.named = {
  // name: (props : any) => <input type='text' ...props/>, number: (props : any)
  // => (<input type='number' ...props/>), date: (props : any) => (<input
  // type='date' ...props/>), roles: inputs.generic.multi.select
};

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

describe('FormFactory', () => {

  const models = {
    person: {
      formSchema: forms.person,
      inputs,
      schema: schemas.person,
      initialValues: {
        firstName: "Mickey",
        lastName: "Mouse"
      },
      onSubmit: () => console.log("submitted")
    }
  };

  const person = new FormViewModelFactory().build(models.person);

  describe('FormFactory: render props API', () => {
    it('should render default formViewModel w/ nothing provided', () => {
      const wrapper = shallow(
        <FormFactory model={person}></FormFactory>
      );
      expect(wrapper).toBeDefined();
      expect(wrapper.html()).toContain("{}");
    });

    it('should support basic functionality with initial values', () => {
      const wrapper = shallow(
        <FormFactory model={person}></FormFactory>
      );
      expect(wrapper).toBeDefined();
      expect(wrapper.html()).toContain(`Harman`);
    });

    it('should support other class constructors', () => {

      class MyBetterFormViewModel extends FormViewModel {
        mySpecialProp = {
          "name": "Mickey Mouse"
        }
      }

      const wrapper = shallow(
        <FormFactory model={person}></FormFactory>
      );
      expect(wrapper).toBeDefined();
      expect(wrapper.html()).toContain(`Mickey Mouse`);
    });
  });

  it('should render w/o crashing', () => {
    const formViewModel = createFormModel();
    const wrapper = shallow(
      <FormFactory model={person}></FormFactory>
    );
    expect(wrapper).toBeDefined();
  });

  it('should allow for onSubmitSuccess to be handled by the component', async() => {
    const formViewModel = createFormModel();
    const onSubmitSuccess = jest.fn();
    const wrapper = shallow(
      <FormFactory model={person}></FormFactory>
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toBeDefined();
    await wait();
    expect(onSubmitSuccess).toHaveBeenCalled();
  });

  it('should allow for updated onSubmitSuccess to be handled by the component', async() => {
    const formViewModel = createFormModel();
    const onSubmitSuccess = jest.fn();
    const wrapper = shallow(
      <FormFactory model={person}></FormFactory>
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toBeDefined();
    await wait();
    expect(onSubmitSuccess).toHaveBeenCalled();
    const newSubmitSuccess = jest.fn();
    wrapper.setProps({onSubmitSuccess: newSubmitSuccess});
    button.simulate('click');
    await wait();
    expect(newSubmitSuccess).toHaveBeenCalled();
  });

  it('should allow for onSubmitError to be handled by the component', async() => {
    const formViewModel = createFormModel();
    formViewModel.validate = () => ({"name": "Name is required"});
    const onSubmitError = jest.fn();
    const wrapper = shallow(
      <FormFactory model={person}></FormFactory>
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toBeDefined();
    await wait();
    expect(onSubmitError).toHaveBeenCalled();
  });

  // See Field for FormFactory <=> Field interaction
});
