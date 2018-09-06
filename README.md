# mobx-form-factory

Build a MobX React form from a set of declarative specifications.
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

## Who is this library for?

- For those want to declare much of their app and have the app generated from these declarations

## Design

The form generator is designed to leverage full declarative specifications of:

- which form fields to render
- field validation rules for models (Yup schema)
- rules for how to render model properties
  - generic rules based on property type
  - rules based on model + property name

### Form model

- `validation.schema`
- `form.schema`

### Validation rules

The form generator uses [json-schema-to-yup](https://www.npmjs.com/package/json-schema-to-yup) to generate a Yup validation schema `validation.schema` based on an extended JSON schema definition passed in as a POJO.

```js
  personSchema: {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/person.schema.json",
    "title": "Person",
    "description": "A person",
    "type": "object",
    "properties": {
      "name": {
        "description": "Name of the person",
        "type": "string"
      },
      "age": {
        "description": "Age of person",
        "type": "number",
        "exclusiveMinimum": 0,
        "required": true
      }
    },
    "required": ["name"]
  }
  // ...
};
```

Usage: `formModel.validation.schema = personSchema`

The validation schema can be extended to provide meta data for how to render each property as a form field:

```js
name: {
  description: 'Name of the person',
  type: 'string'
  maxLength: 20,
  minLength: 3,
  // extra field meta data
  field: {
    type: 'text',
    format: 'alpha-numeric',
    placeholder: 'Enter your full name'
  }
},
```

The form will render fields for all properties specified in the validation schema by default, etracting and using whatever field information is provided, falling back to generic field render rules.

## Form declaration

The form generator can also take a form declaration that specifies exactly which fields to render and which registered field generator to use for each field.

You can register (or override) field generators on the form model as needed.

```js
const personForm = {
  fields: {
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
};
```

We should allow (multi?) extension of form declarations.

```js
const developerForm = {
  extends: "personForm",
  fields: {
    languages: {
      input: "select"
    }
  }
};
```

Usage: `formModel.form.schema = personForm`

## Fields control

The form declaration and validation schema alone might not provide sufficient control over exactly which fields to render.

The form might need to render additional (transient) fields that are not directly linked to the underlying model. Sometimes you might need to only render a subset of the fields, for security concerns etc. How to best handle these scenarios?

```js
  scenarios: {
    default: {
      fields: {
        firstName: {
          // overrides
          component: 'auto-complete'
        }
      },
      include: {
        only: ['firstName', 'lastName']
      }
    }
  }
```

## Field registrations

```js
input = {}

// Register generic fields
inputs.generic = {
  single: {
    select: props => (
      <select {...props}>
        {props.options.map((option, index) => {
          <option name={option.name}>{option.value}</option>
        })}
      </select>
  },
  multi: {
    select: props => <MultiSelect {...props}/>,
    checkbox: props =>  <Checkboxes {...props} />
  }
}
```

```js
// Register for named fields
inputs.named = {
  firstName: props => <input type="text" {...props} />,
  age: props => <input type="number" {...props} />,
  birthDate: props => <input type="date" {...props} />,
  roles: inputs.generic.multi.select
};
```

However `person.name` might be very different from `product.name`, perhaps having an auto-complete rendered for each...

```js
inputs.named = {
  product: {
    name: props => <AutoComplete {...props} />
  }
};
```

## Field generators

By default, the following type to field mappings are used:

```js
const defaults = {
  typeFieldMap: {
    string: "text",
    array: "select",
    date: "date",
    boolean: "radio"
  }
};
```

This means that a property of `type: "string"` (validation schema) will be looked up in this map to match a `text` field generator.

The `text` field generator will by default render a simple `<input type="text">` field, (implicitly) using the `<Field>` component of [mobx-form-model](https://github.com/hrgui/mobx-form-model)

You can also map a type to a function

`array: (property) => property.format || 'text'`

TODO: Where do you register this map?

##

## Example

```jsx
import { observer } from "mobx-react";
import { observable } from "mobx";
import React from "react";
import { render } from "react-dom";
import { FieldFactory, FormModelFactory, FormFactory } from "mobx-form-factory";

const schemas = {
  person: require("./schemas/person.json")
};


const models = {
  person: {
    form: forms.person,
    inputs,
    schema: schemas.person,
    values: {
      firstName: 'Mickey',
      lastName: 'Mouse'
    },
    onSubmit: () => console.log('submitted')
  }
};

// creates a Person FormViewModel class

@observer
export class PersonForm extends React.Component {
  @observable
  // select a form model to use
  const person = FormViewModelFactory.build(models.person);

  render() {
    return (
      <AutoForm model={this.person}>
      {
        actions: [
          <button className={btn.primary} onClick={this.person.handleSubmit}>Save</button>
        ]
      }
      </AutoForm>
    );
  }
}

render(<PersonForm />, document.getElementById("root"));
```

Note that if you don't specify a forms map value for a given field, it will use the schema metadata to automatically select an appropriate field type. The forms map is only for you to have more control if/when needed.

# How it works

`<AutoForm />` uses a factory and an extended `FormViewModel` to build a form.
The fields linked and kept in sync with the underlying view model.

A validation `schema` is used to create a `Yup` validation schema as required by `mobx-form-model` to validate the field values.

A `forms` map is used to map field names to field components and thus used to indicate to the `FieldsFactory` how to create each field.

Use the `FormFields` component to render the fields using the `FieldsFactory` or provide your own mechanism.

```jsx
<AutoForm model={this.person}>
{
  header: <h1>Person</h1>,
  // fields: use default FormFields
  ,
  actions: [
    <button className={btn.primary} onClick={this.person.handleSubmit}>Save</button>,
    <button className={btn.secondary} onClick={this.person.handleCancel}>Cancel</button>,
  ]
}
</AutoForm>
```

## API

See [docs](docs/README.md)

## License

MIT
