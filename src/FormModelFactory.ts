import {observable} from 'mobx';
import {set} from 'lodash';
import {FormViewModel} from '@hrgui/mobx-form-model'

export default interface IFormModelFactory {};

export default class FormModelFactory {
  values : any[]
  constructor() {
    this.values = []
  }
  build(config
    ?
    : any) : FormViewModel {
    return new FormViewModel(this.values)
  }
}
