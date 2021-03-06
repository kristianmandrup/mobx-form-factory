# mobx-form-factory

Build a MobX React form from a set of declarative specifications.
The form builder leverages the following libraries:

- [mobx-form-model](https://github.com/hrgui/mobx-form-model)
- [yup](https://github.com/jquense/yup)
- [json-schema-to-yup](https://www.npmjs.com/package/json-schema-to-yup)

## Status

WIP: Under design and construction... Trying to figure out a good, flexible design.

## TOC

- [Design](#design)
- [Example](#example)
- [How it works](#how-it-works)
- [API](#api)

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

Usage: `model.validation.schema = personSchema`

```js
name: {
  description: 'Name of the person',
  type: 'string'
  maxLength: 20,
  minLength: 3,
},
```

The form will render fields for all properties specified in the validation schema by default, etracting and using whatever field information is provided, falling back to generic field render rules.

## Form schema

The form generator can also take a form schema that specifies exactly which fields to render and which registered field generator to use for each field.

You can register (or override) field generators on the form model as needed.

```js
const fields = {}
fields.generic =
  'alpha-numeric': {
    // ...
  }
}

fields.name = {
  name: {
    extends: 'alpha-numeric',
    length: 20, // default
    chars: 20 // default
  },
  "number:year:future" {
    extends: 'number:year',
    min: () => Year.current()
}


const formLayout = {
  small: {
    maxLength: 20
    maxChars: 20
  },
  medium: {
    minLength: 20,
    maxLength: 40
  },
  large: {
    minLength: 40,
    maxLength: 80
  }
}
```

```js
const personForm = {
  fields: {
    password: {
      input: "password",
      minLength: 8,
      strength: 'strong'
    },
    repeatPassword: {
      input: "password",
      display: ({values, fields}) => {
        return values.password.length > 1
      },
      enable: ({values, fields}) => {
        return values.password.length > fields.password.minLength
      }
    }
    firstName: {
      input: "name",
      placeholder: "First name",
      // ie. state reducer for controlled form value
      transform: (value) => value.capitalize()
      length: 20, // default
      chars: 20 // default
    },
    lastName: {
      input: "name",
      // use named transform
      transform: 'capitalize'
      // derive from humanized field name
      // placeholder: "Last name"
    },
    month: {
      input: "number:month",
      placeholder: "MM"
      // implicit
      // chars: 2
    },
    slash: {
      text: "/"
    },
    year: {
      input: "number:year:future",
      placeholder: "YY",
      // min: derived
      default: ({value, field}) => field.min + 1,
      max: ({value, field}) => field.min + 10,
      // implicit
      // chars: 2
    },
    code: {
      input: "secret",
      chars: 3
    },
    number: {
      input: "number:creditcard"
      // implicit
      // placeholder: "Creditcard number"
      // length: 20,
      // chars: 16
    }
  },
  actions: {
    cancel: {
      enable: ({form}) => {
        return form.dirty
      }
    },
    submit: {
      enable: ({form}) => {
        return form.valid
      }
    }
  }
  layout: {
    align: 'justify left',
    fields: [
      {
        // on medium or larger display, will displayed on one row
        // see formLayout above
        // implicit justify left alignment
        name: ["firstName", "lastName"]
      },
      {
        expiry: [
          {
            year: {
              align: 'left',
              cells: ["month", "slash", "years"],
            }, {
            code: {
              align: 'right',
              cels: ["code"]
            }
          }
      },
      "number"
    ],
    actions: [
      'cancel', 'submit'
    ]

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

Usage: `model.form.schema = personForm`

## Fields control

The form declaration and validation schema alone might not provide sufficient control over exactly which fields to render.

The form might need to render additional (transient) fields that are not directly linked to the underlying model. Sometimes you might need to only render a subset of the fields, for security concerns or otherwise.

To allow for such flexibility we could inject (provide) a `context` from the Context API.
Additionally we could have the view model for the form provide data derived from the values entered in the form and use this data, in addition to the values, error and context to determine whether to display each field (using MobX observer).

Each field could have a special display property that is on/off to determine whether to display the field.

Form Model (ie. extended View Model):

```js
values,
  errors,
  data, // derived obj
  display; // derived obj
```

This full "form model" could then be provided via Context API down the tree and be Consumed and observed for changes.

To make more flexible use render props pattern, passing a function as children, that takes generated model and passes down to use for internal form rendering
Then wrap header, actions and form fields components with form consumer.

`AutoField` should take a componentSelector by default generated by the form model. Use this to select the component t used to pass to Field.

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
