# mobx-form-factory

Build a MobX React Form from a declarative specification (JSON Schema).
The form builder leverages the following libraries:

- [mobx-form-model](https://github.com/hrgui/mobx-form-model)
- [yup](https://github.com/jquense/yup)
- [json-schema-to-yup](https://www.npmjs.com/package/json-schema-to-yup)

## Status

WIP: Under construction...

## TOC

- [Who is this library for?](#who-is-this-library-for)
- [Example](#example)
- [How it works](#how-it-works)
- [API](#api)

# Who is this library for?

- For those want to declare much of their app and have the app generated from these declarations

# Example

```jsx
import { observer } from "mobx-react";
import { observable } from "mobx";
import React from "react";
import { render } from "react-dom";
import { FieldFactory, FormModelFactory, FormFactory } from "mobx-form-factory";

const schemas = {
  person: require("./schemas/person.json")
  // ...
};

const inputs = {
  name: props => <input type="text" name={props.name} value={props.value} />,
  number: props => (
    <input type="number" name={props.name} value={props.value} />
  ),
  "multiSelect": props => (
    <MultiSelect
      name={props.name}
      options={props.options}
      selected={props.selected}
    />,
  "checkboxes": props => (
    <Checkboxes
      name={props.name}
      options={props.options}
      selected={props.selected}
    />
  )
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

const models = {
  person: {
    form: forms.person,
    schema: schemas.person,
    initialValues: {
      firstName: "Mickey",
      lastName: "Mouse"
    },
    onSubmit: () => console.log("submitted")
  }
};

// creates a Person FormViewModel class
const Person = FormModelFactory.create(models.person);

@observer
export class PersonForm extends React.Component {
  @observable
  person = new Person();
  formFactory = new FormFactory(this.person);

  render() {
    return (
      <FormFactory factory={formFactory}>
        <button onClick={this.person.handleSubmit}>Save</button>
      </FormFactory>
    );
  }
}

render(<PersonForm />, document.getElementById("root"));
```

# How it works

`<FormFactory />` uses a factory and a generated `FormViewModel` to create a form with a set of fields. The fields linked and kept in sync with the underlying view model.

A validation `schema` is used to create a `Yup` validation schema as required by `mobx-form-model` to validate the field values.

A `forms` map is used to map field names to field components and thus used to indicate to the `FieldsFactory` how to create each field.

# API

See [docs](docs/README.md)
