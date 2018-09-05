import FormModelFactory from './FormModelFactory';

describe('FormModelFactory', () => {
  describe('isValid', () => {
    it('should return true if there are no errors', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()
      formViewModel.setErrors({});
      expect(formViewModel.isValid).toBe(true);
    });

    it('should return false if there are errors', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()
      formViewModel.setErrors({a: 1});
      expect(formViewModel.isValid).toBe(false);
    });
  });

  describe('getValueFromInputEvent', () => {
    it('should know how to process a normal string value', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getValueFromInputEvent({value: 'hello'})).toBe('hello');
    });

    it('should know how to process a normal checkbox value', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getValueFromInputEvent({value: 'hello', checked: true, type: 'checkbox'})).toBe(true);
    });

    it('should know how to process a numerical value', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getValueFromInputEvent({value: 35, type: 'number'})).toBe(35);

      expect(formViewModel.getValueFromInputEvent({value: 35, type: 'range'})).toBe(35);
    });
  });

  describe('getNameFromInputEvent', () => {
    it('should know how to process name if given', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getNameFromInputEvent({name: 'name'})).toBe('name');
    });

    it('should take in name still even if id is given', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getNameFromInputEvent({name: 'name', id: 'blah'})).toBe('name');
    });

    it('should fall back to id if name not provided', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      expect(formViewModel.getNameFromInputEvent({id: 'blah'})).toBe('blah');
    });
  });

  describe('handleChange', () => {
    it('should handle basic case of textinput', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.handleChange({
        target: {
          name: 'name',
          value: 'Mickey'
        }
      });
      expect(formViewModel.values.name).toEqual('Mickey');
    });

    it('should handle custom case where target not defined', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.handleChange({name: 'name', value: 'Mickey'});
      expect(formViewModel.values.name).toEqual('Mickey');
    });

    it('should persist', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      const persist = jest.fn();
      formViewModel.handleChange({name: 'name', value: 'Mickey', persist});
      expect(persist).toHaveBeenCalled();
      expect(formViewModel.values.name).toEqual('Mickey');
    });
  });

  describe('handleBlur', () => {
    it('should handle basic case of textinput', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.handleBlur({
        target: {
          name: 'name',
          value: 'Mickey'
        }
      });
      expect(formViewModel.touched.name).toEqual(true);
    });

    it('should handle custom case', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.handleBlur({name: 'x'});
      expect(formViewModel.touched.x).toEqual(true);
    });
  });

  describe('setFieldValue', () => {
    it('should literally set the field value', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setFieldValue('name', 'Mickey');
      expect(formViewModel.values.name).toEqual('Mickey');
    });

    it('should literally set the field value, nested', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setFieldValue('person.name', 'Mickey');
      expect(formViewModel.values.person.name).toEqual('Mickey');
    });
  });

  describe('setValues', () => {
    it('should set the values object', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setValues({name: 'Mickey'});
      expect(formViewModel.values.name).toEqual('Mickey');
    });
  });

  describe('setFieldTouched', () => {
    it('should set field as touched', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setFieldTouched('person.name', true);
      expect(formViewModel.touched.person.name).toEqual(true);
    });

    it('should handle parent child relationships', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      const childFormViewModel = formModelFactory.build({x: 1})

      formViewModel.addChildFormModel(childFormViewModel, "person");
      childFormViewModel.setFieldTouched('name', true);
      expect(formViewModel.touched.person.name).toEqual(true);
    });
  });

  describe('setFieldError', () => {
    it('should set field as error', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setFieldError('person.name', true);
      expect(formViewModel.errors.person.name).toEqual(true);
    });
  });

  describe('setErrors', () => {
    it('should set the errors object', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setErrors({name: 'Mickey'});
      expect(formViewModel.errors.name).toEqual('Mickey');
    });
  });

  describe('setSubmitting', () => {
    it('should set the value as submitting', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setSubmitting(true);
      expect(formViewModel.isSubmitting).toEqual(true);
    });
  });

  describe('runValidations', () => {
    it('should run validation schema validation', async() => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.validationSchema = {};
      //@ts-ignore
      formViewModel.runValidationSchema = jest
        .fn()
        .mockReturnValueOnce({name: 'This field is required'});
      expect(await formViewModel.runValidations()).toEqual(false);
      expect(formViewModel.errors).toEqual({name: 'This field is required'});
    });

    it('should run validation schema validation and validate', async() => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.validationSchema = {};
      //@ts-ignore
      formViewModel.runValidationSchema = jest
        .fn()
        .mockReturnValueOnce({name: 'This field is required'});
      formViewModel.validate = jest
        .fn()
        .mockReturnValueOnce({age: 'This field is required'});
      expect(await formViewModel.runValidations()).toEqual(false);
      expect(formViewModel.errors).toEqual({name: 'This field is required', age: 'This field is required'});
    });

    it('should handle parent child relationships', async() => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      const childFormViewModel = formModelFactory.build()
      formViewModel.addChildFormModel(childFormViewModel, "person");
      childFormViewModel.validationSchema = {};
      childFormViewModel.runValidationSchema = jest
        .fn()
        .mockReturnValueOnce({name: 'This field is required'});
      expect(await formViewModel.runValidations()).toEqual(false);
      expect(formViewModel.errors.person.name).toEqual("This field is required");
    });

  });

  describe('onReset', () => {
    it('should reset the form to its initial values', () => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.initialValues = {
        name: 'Naruto Uzumaki'
      };
      formViewModel.setFieldValue('name', 'Mickey Mouse');
      formViewModel.onReset();
      expect(formViewModel.values.name).toEqual('Naruto Uzumaki');
      expect(formViewModel.isValid).toBeTruthy();
    });
  });

  describe('submitForm', () => {
    it('should submit the form (success state)', async() => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setValues({name: 'Mickey Mouse'});
      formViewModel.onSubmitSuccess = jest.fn();
      formViewModel.onSubmit = jest.fn();
      await formViewModel.submitForm();
      expect(formViewModel.onSubmitSuccess).toHaveBeenCalled();
    });

    it('should call onSubmitError since validate returns an object of errors', async() => {
      const formModelFactory = new FormModelFactory();
      const formViewModel = formModelFactory.build()

      formViewModel.setValues({name: null});
      formViewModel.onSubmitError = jest.fn();
      formViewModel.onSubmit = jest.fn();
      formViewModel.validate = () => ({name: 'This is required'});
      await formViewModel.submitForm();
      expect(formViewModel.onSubmitError).toHaveBeenCalled();
    });
  });
});
