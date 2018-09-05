import {observable} from 'mobx';
import {set} from 'lodash';
import {FormViewModel} from '@hrgui/mobx-form-model'
import {buildYup} from 'json-schema-to-yup'

export default interface IFormViewModelFactory {
  build(config : any) : FormViewModel;
};

class XFormViewModel extends FormViewModel {
  setField(key, config : any) {
    const obj = config[key]
    obj.value && this.setFieldValue(key, obj.value)
    return this
  }

  setFields(config : any) {
    Object
      .keys(config)
      .map(key => {
        this.setField(key, config[key])
      })
    return this
  }
}

export default class FormViewModelFactory {
  values : any[]
  inputs : any
  formSchema : any
  fieldNames : string[]
  typeComponentMap : any
  fields : any
  yupSchema : any
  validationSchema : any
  viewModel : XFormViewModel
  constructor(formSchema : any = {}) {
    this.formSchema = formSchema;
    this.values = formSchema.values;
    this.inputs = formSchema.inputs;
    // TODO: if not passed in, create from schema
    this.yupSchema = formSchema.yupSchema;
    this.validationSchema = formSchema.validationSchema || formSchema.schema;
    // TODO: extend by merging instead
    this.fieldNames = formSchema.fieldNames || this.extractFieldNames()
    this.fields = formSchema.fields || this.extractFields()
  }

  protected extractFieldNames() {
    return Object.keys(this.validationSchema.properties || {})
  }

  protected extractFields() {
    const {properties} = this.validationSchema
    return this
      .fieldNames
      .reduce((acc : any, name : string) => {
        return {
          name,
          ...properties[name].meta
        }
      }, {})
  }

  protected transferFn(name) {
    if (this.formSchema[name]) {
      this.viewModel.validate = this.formSchema[name];
      this
        .viewModel[name]
        .bind(this.viewModel);
    }
  }

  protected transferFns(...names) {
    names.map(this.transferFn.bind(this));
  }

  build(config : any = {}) : XFormViewModel {
    const {initialValues} = this.formSchema;
    const viewModel = new XFormViewModel(this.values);
    viewModel.initialValues = initialValues;
    viewModel.validationSchema = this.yupSchema || buildYup(this.validationSchema);
    this.viewModel = viewModel;
    this.transferFns('validate', 'onSubmit', 'onSubmitSuccess');
    return viewModel;
  }
}
