import * as React from 'react';
import {shallow} from 'enzyme';
import FormFactory from './FormFactory';
import FormViewModel from './FormViewModel';
import {wait} from './testUtils';

describe('FormFactory', () => {

  describe('FormFactory: render props API', () => {
    it('should render default formViewModel w/ nothing provided', () => {
      const wrapper = shallow(
        <FormFactory>
          {({model}) => {
            return <div>Hello World {JSON.stringify(model.values)}</div>
          }}
        </FormFactory>
      );
      expect(wrapper).toBeDefined();
      expect(wrapper.html()).toContain("{}");
    });

    it('should support basic functionality with initial values', () => {
      const wrapper = shallow(
        <FormFactory initialValues={{
          name: "Harman"
        }}>
          {({model}) => {
            return <div>Hello World {JSON.stringify(model.values)}</div>
          }}
        </FormFactory>
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
        <FormFactory
          initialValues={{
          name: "Harman"
        }}
          modelConstructor={MyBetterFormViewModel}>
          {({model}) => {
            return <div>Hello World {JSON.stringify(model.mySpecialProp)}</div>
          }}
        </FormFactory>
      );
      expect(wrapper).toBeDefined();
      expect(wrapper.html()).toContain(`Mickey Mouse`);
    });
  });

  it('should render w/o crashing', () => {
    const formViewModel = new FormViewModel();
    const wrapper = shallow(
      <FormFactory model={formViewModel}>Hello World</FormFactory>
    );
    expect(wrapper).toBeDefined();
  });

  it('should allow for onSubmitSuccess to be handled by the component', async() => {
    const formViewModel = new FormViewModel();
    const onSubmitSuccess = jest.fn();
    const wrapper = shallow(
      <FormFactory model={formViewModel} onSubmitSuccess={onSubmitSuccess}>
        <button onClick={e => formViewModel.handleSubmit(e)}>Submit</button>
      </FormFactory>
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toBeDefined();
    await wait();
    expect(onSubmitSuccess).toHaveBeenCalled();
  });

  it('should allow for updated onSubmitSuccess to be handled by the component', async() => {
    const formViewModel = new FormViewModel();
    const onSubmitSuccess = jest.fn();
    const wrapper = shallow(
      <FormFactory model={formViewModel} onSubmitSuccess={onSubmitSuccess}>
        <button onClick={e => formViewModel.handleSubmit(e)}>Submit</button>
      </FormFactory>
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
    const formViewModel = new FormViewModel();
    formViewModel.validate = () => ({"name": "Name is required"});
    const onSubmitError = jest.fn();
    const wrapper = shallow(
      <FormFactory model={formViewModel} onSubmitError={onSubmitError}>
        <button onClick={e => formViewModel.handleSubmit(e)}>Submit</button>
      </FormFactory>
    );
    const button = wrapper.find('button');
    button.simulate('click');
    expect(wrapper).toBeDefined();
    await wait();
    expect(onSubmitError).toHaveBeenCalled();
  });

  // See Field for FormFactory <=> Field interaction
});
