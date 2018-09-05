import {observable} from 'mobx';
import {set} from 'lodash';
import {FormViewModel} from '@hrgui/mobx-form-model'
import {buildYup} from 'json-schema-to-yup'

export default interface IFormViewModelFactory {
  build(config : any) : FormViewModel;
};

export default class FormViewModelFactory {
  values : any[]
  inputs : any
  formSchema : any
  fieldNames : string[]
  typeComponentMap : any
  fields : any
  yupSchema : any
  validationSchema : any
  viewModel : FormViewModel
  constructor(formSchema : any = {}) {
    this.formSchema = formSchema;
    this.values = formSchema.values;
    this.inputs = formSchema.inputs;
    this.yupSchema = formSchema.yupSchema;
    this.validationSchema = formSchema.validationSchema || formSchema.schema;
  }

  private transferFn(name) {
    if (this.formSchema[name]) {
      this.viewModel.validate = this.formSchema[name];
      this
        .viewModel[name]
        .bind(this.viewModel);
    }
  }

  private transferFns(...names) {
    names.map(this.transferFn.bind(this));
  }

  build(config : any = {}) : FormViewModel {
    const {initialValues} = this.formSchema;
    const viewModel = new FormViewModel(this.values);
    viewModel.initialValues = initialValues;
    viewModel.validationSchema = this.yupSchema || buildYup(this.validationSchema);
    this.viewModel = viewModel;
    this.transferFns('validate', 'onSubmit', 'onSubmitSuccess');
    return viewModel;
  }
}
