import {observable} from 'mobx';
import {set} from 'lodash';
import {FormViewModel} from '@hrgui/mobx-form-model'
import {buildYup} from 'json-schema-to-yup'

export interface IFormViewModelFactory {
  build(config : any) : FormViewModel;
};

export class XFormViewModel extends FormViewModel {

  formSchema : any

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

export class FormViewModelFactory {
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

    this.yupSchema = formSchema.yupSchema;
    this.validationSchema = formSchema.validationSchema || formSchema.schema;

    // extend by merging
    this.fields = this.extractFields(formSchema.fields);
    this.fieldNames = this.extractFieldNames(formSchema.fieldNames);
  }

  protected extractFieldNames(fieldNames) : string[] {
    return fieldNames.only
      ? fieldNames.only
      : [
        ...this.extractFieldNamesFromSchemaProps(),
        ...this.extractFieldNamesFromFields(),
        fieldNames.fieldNames.include
      ];
  }

  protected extractFieldNamesFromSchemaProps() {
    return Object.keys(this.validationSchema.properties || {})
  }

  protected extractFieldNamesFromFields() {
    return Object.keys(this.fields || {})
  }

  protected extractFields(fields : any) {
    return fields.only
      ? fields.only
      : {
        ...this.extractFieldsFromSchema(),
        ...fields.include
      }
  }
  protected extractFieldsFromSchema() {
    const {properties} = this.validationSchema
    return this
      .fieldNames
      .reduce((acc : any, name : string) => {
        return {
          name,
          ...this.extractFieldDataFromSchemaProperty(properties[name])
        }
      }, {})
  }

  protected extractFieldDataFromSchemaProperty(property : any) {
    return property.field || {}
  }

  protected transferFn(name) {
    if (this.formSchema[name]) {
      this.viewModel[name] = this.formSchema[name];
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
    viewModel.formSchema = this.formSchema;
    this.viewModel = viewModel;
    this.transferFns('validate', 'onSubmit', 'onSubmitSuccess');
    return viewModel;
  }
}
