# Using React Json Schema Form

## Basics

Single file with JSON schema and UI Schema (and Table presentation),
in `specs/jsonschemas/src` directory.

Example:

```YAML
jsonschema:
  type: object
  properties:
    firstName:
      type: string
      title: First Name
      description: "First name"
    lastName:
      type: string
      title: Last Name
      description: "Last name"
    ...
uiHints:
  form:
    uiSchema:
      "ui:order":
        - firstName
        - lastName
        - phone
            ...
      firstName:
        "ui:widget": <Widget Name>
        ...
```

## Inclusion of schemas

If you have common sets of repeating schemas (e.g. address,person
etc), you can define once in definitions.yaml file and "include"
reference like this:

```YAML
jsonschema:
  type: object
  properties:
    landOwner:
      title: Land Owner Information
      allOf:
        - $ref: "#/definitions/Person"
```

Here, Person's definition is included for `landOwner` property.

## Basic Forms

All forms are rendered with a set of custom widgets.

## Handling Object References

Object references are stored in the DB, as strings in the following
format: `<schemaId>:<id>:display-string`. The schema Id for a
specific field is defined in the schema YAML files like this:

```YAML
jsonschema:
  properties:
    personalDetails:
      title: Personal Details
      description: Personal details of this farmer
      $ref: "#/definitions/Person"
    userId:
      $ref: "#/definitions/UserId"
      schemaId: /farmbook/User
```

The schemaId field is removed when JSON schema file is generated, but
is stored in generated code, and is used for rendering meaningful
display strings, prompt the right selection widget,etc.

# Handling long, nested objects

The following are some thoughts on how we might handle long, nested
forms.

1.  **Wizard Format**: Define `ui:widget` at the top level `uiSchema`
    to be `WizardWidget`. Each sub object that goes into a separate step
    should use a `ui:widget` directive, with `WizardStepWidget`.

        For example, LandParcel uiSchema might look like this:

        ```YAML
        uiHints:
          form:
            uiSchema:
              "ui:order":
                - surveyNumber
                - areaInAcres
                        ...
                    waterSources:
                        "ui:widget": WaterSourcesWizStep
                    powerSources:
                        "ui:widget": PowerSourcesWizStep
                    ...
        ```

2.  **Custom Grid with multiple forms**: We have a layout grid that
    specifies where each sub-section will go. The sub-sections do not have
    a submit button. The top-level component holds the form data object
    and passes the subsections via props, and monitors changes within
    those subsections. Each subsection displays the fields it wants and
    hides the others via `ui:widget: hidden` directive.

        So in `LandParcel` case, we might have a `BasicDetails` section, a
        `LandOwner` section, a `WaterSources` section and a `PowerSources`
        section. Then, the `BasicDetails` would look like this:

        ```YAML
        BasicDetails:
          uiSchema:
            ...
            landOwner:
              "ui:widget": hidden
            waterSources
              "ui:widget": hidden
            powerSources:
              "ui:widget": hidden
            ...
        ```
        LandOwner:

        ```YAML
        BasicDetails:
          uiSchema:
            surveyNumber:
              "ui:widget": hidden
            address:
              "ui:widget": hidden
            landOwner:
              "ui:widget": LandOwnerWidget
            waterSources
              "ui:widget": hidden
            powerSources:
              "ui:widget": hidden
            ...
        ```

        and so on.

3.  **Grid with pre-assigned slots**: The form is plugged into a
    special layout react component with pre-assigned slots for
    sub-objects. The widgets passed for the sub-objects specify the slot
    they will be plugged into. For example, for the land parcel schema,
    the top-level widget might specify a layout like the following:

        ```yaml
        tag: Grid
        # the layout spec below specifies a 2x2 grid with
        # 4 grid-columns for each column
        layout: |+
          BasicDetails:4 > OwnerDetails:4
          WaterSources:4 > PowerSources:4
          ...
        ```

        The corresponding yaml schema def file:

        ```yaml
        uiHints:
          form:
            uiSchema:
              surveyNumber:
                "ui:options":
                  ui:widget: GridSlotTextField
                  slot: BasicDetails
              landOwner:
                "ui:widget": OwnerDetails
        ```

4.  **Custom ObjectFieldTemplate and ArrayFieldTemplate**: Specify a
    custom `ObjectFieldTemplate` at each `type: object` level. Let the
    `Template` component decide how to position its fields.

5.  **Just Long Form**: No customization other than custom widgets for
    object selection for references.

6.  **Just Long Form sans Arrays (Custom UIs for Arrays)**: Display
    non-nested, simple parts of the form in one area, and show the more
    complex parts in separate sections of the screen. For example, in the
    case of `LandParcel`, we have a section for basic fields, and then
    have tables for water sources, power sources etc in a master-detail
    mode - i.e., a table shows a list of elements with add/remove/up/down
    buttons in each row with collapsable edit (like accordion). Very
    similar to the default array handling, but with a customized UI that
    takes up less space and looks better.

7.  **All Custom UI**: Design a completely custom UI for the object and
    use the form features only for validation (if that!).
