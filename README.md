# ReactML Demo

## Instructions 
  
0. Setup: `yarn`   
   
1. Initial setup: `yarn run build:setup`  
2. Start watcher like this: `yarn run codegen:watch`      
3. Running code generator in non-watch mode: `yarn run codegen`     
4. Buid nextjs bundle: `yarn run build:next`        
5. Clean build command: `yarn run clean-build`                
6. Cleaning up build files: `yarn run build:clean`                        
7. UI Specfication files are in the `spec/src` folder                             
        
NOTE:          
        
`yarn` is required. `npm` is unable to install material UI version of react json schema form.

## UI code generation - Specification files

These are simple XML or YAML files specifying tree structure of a
react component.
and [XML](specs/src/Example.rtml.xml).

The source files must be located in `specs/src` and have .rtml.yaml or
.rtml.xml extension.





The YAML file represents the internal structure required by the code
generator (XML file is converted to this structure after parsing). The
specification is simple tree structure - just follow the hierarchy of
the UI structure. Each react node is a node in this tree. Each node
has the following properties (javascript/coffeescript objects):

- tag: a string used to specify the react component to use. For XML,
  this is the XML tag used.
- name (optional) - optional user-specified name to indicate in
  generated code. Note that name is specified as an attribute, and
  required on top nodes of XML files.
- `importPath` (optional) - an import path may be specified for any
  node. If specified, it must be set to the import path as specified
  in a react file. The import path is used to load the tag for the
  node.
  Import path may optionally specify a symbol to import with a "#"
  separator, similar to HTML URL links. So, this XML :




```xml
<MyMarker importPath="react-calendar-timeline#TodayMarker"/>
```

or this YAML:

```yaml
tag: MyMarker
importPath: react-calendar-timeline#TodayMarker
```

generates code like this:

```javascript
import { TodayMarker as MyMarker } from 'react-calendar-timeline';
```

- children - An array of children components. In YAML this is
  specified as an arry under a `children` node. In XML these are
  child XML nodes.
- component - a boolean indicating if this node needs to be treated
  as a reusable react component. REact code will be generated in a
  separate file if it's true
- imported - a boolean flag indicating that this is an imported
  component. An import statement is added to the generated code.
  - `pageName` - Indicates that this is a page level component. Code
    is generated inside gen/pages directory
- `datasource` - For components with `pageName` attribute only. This
  allows specification of a function or a graphql query, to be used
  in getServerSideProps function. It allows specification of
  permitted user roles (`permittedRoles`), name and location of the
  functoin(`import`), and a type (`function` or `graphql`). See
  example here: [Example](specs/src/FarmersPage.rtml.yaml)

- You can set state variables like this:
  $s:<name>:<value>:<default>. The default part is optional. The
    value part can be a `$p` expression indicating that the value
  should be taken from props. Example:

      $s:foo:bar:baz

      means that `foo` should be set to `bar`.  `foo` will be
      initialized to `baz`.

  - You can use state variables like this: $s.x where x is the name of 
    the state variable. Note that these will work in properties, but
    to use in the middle of text is tricky. You can specify $s.x in a
    text node only when there is nothing else in that node. I.e. this
    will work: `<span>$s.color</span>`. But this will not work: `<span>my color is $s.color</span>`

- Global state: Global state is specified with `$c` directive. This is very similar to `$s` usage, i.e. `$c:<name>:<value>` for setting a variable and `$c.<name>` for retrieving values. State variables are maintained in a JS object inside a context, and internally uses the `useContext` hook. See [specs/src/examples/Example.rtml.xml](specs/src/examples/Example.rtml.xml) for exmaple usage.

Note:

1. Strings are considered react components
2. `tag` is optional. If not provided, React.Fragment will be used. tag names are automatically looked up in material UI component library.
3. Material UI is injected into generated code
   automatically. Material UI components are available as $M.xx
   where xx is the name of material UI component. Note $M and $I are no
   longer required to be specified.
4. Dynamic props are specified with notation `$p.x` where `$p`
   stands for `props` and `x` is the name of the field inside
   `props`.
5. Two special components, `Loop` and `If` are provided for
   conditional and looped items. See [If example
   here](specs/src/Example.rtml.xml) and [Loop example
   here](specs/src/LoopExample.rtml.xml)

### XML Limitations

XML format has the following limitations:

1. Properties have to be simple scalar types and can't be objects,
   arrays etc.
2. Component name must be specified at the top level, as an attribute

## Backend object models

Object models may be specified in YAML format ([Example](specs/jsonschemas/src/FarmerOnBoarding.yaml)).
The structure of these YAML files is as follows. Top nodes:

- `jsonschema` - JSON schema structure for the object being defined
- `uiHints` - UI hints to generate UI code
- `uiHints.form.uiSchema` - UI schema to be passed to react json
  schema editor
- `uiHints.table.dataGridOptions` - Object to be passed MUI's data
  grid component.

## Generated code file tree

- `gen/jsonschemas` - JSON schema files to be used in validating data
- `gen/*.rtml.jsx` - Generated react component code
- `gen/pages/*.rtml.jsx` - Page-level react components
- `gen/pages/api/*` - server-side API code for various object models
- `gen/pages/api/<MODEL>/*` - server-side API code for a
  specific object model defined in `specs/jsonschemas/src`. These are
  meant to be used as HTTP handlers in API routes and
  getServerSideProps() functions

TODO:

1. Refresh token handling
1. Page "flashing" between transitions
1. Object creation testing
1. Object (reference) display and selection in forms
1. Make forms slimmer and slicker
1. Better rendering of array items in RJSF
1. Dealing with long forms
1. Make the app more snappy
1. Specification of workflows
1. Provide a way to specify shared state via contexts
1. ~~Convert `imported` statement to take an import statement to use
   arbitrary react component~~
1. Cleanup code generator code
1. Inject callback functions in the frontend
1. ~~Import user defined components~~
1. ~~Inject data~~

## How to create an HTTPS certificate for localhost domains

This focuses on generating the certificates for loading local virtual hosts hosted on your computer, for development only.

### Certificate authority (CA)

Generate `RootCA.pem`, `RootCA.key` & `RootCA.crt`:

    openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout ./certificates/RootCA.key -out ./certificates/RootCA.pem -subj "/C=US/CN=CarbonMint-CA"
    openssl x509 -outform pem -in ./certificates/RootCA.pem -out ./certificates/RootCA.crt

### Domain name certificate

Let's say you have two domains `app.lvh.me` and `app.localhost.me` that are hosted on your local machine
for development (using the `hosts` file to point them to `127.0.0.1`).

First, create a folder `localhost` and then create a file `localhost.ext` in side folder that lists all your local domains(only if file not available):

    authorityKeyIdentifier=keyid,issuer
    basicConstraints=CA:FALSE
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    subjectAltName = @alt_names
    [alt_names]

    DNS.1 = localhost
    DNS.2 = *.lvh.me
    DNS.3 = *.localhost.me
    IP.1 = 127.0.0.1

Generate `localhost.key`, `localhost.csr`, and `localhost.crt`:

    openssl req -new -nodes -newkey rsa:2048 -keyout ./certificates/localhost/localhost.key -out ./certificates/localhost/localhost.csr -subj "/C=US/ST=NY/L=NY/O=Example-Certificates/CN=localhost.local"
    openssl x509 -req -sha256 -days 1024 -in ./certificates/localhost/localhost.csr -CA ./certificates/RootCA.pem -CAkey ./certificates/RootCA.key -CAcreateserial -extfile ./certificates/localhost/localhost.ext -out ./certificates/localhost/localhost.crt

### Trust the local CA

At this point, the site would load with a warning about self-signed certificates.
In order to get a green lock, your new local CA has to be added to the trusted Root Certificate Authorities.

### Windows 10: Chrome, IE11 & Edge

Windows 10 recognizes `.crt` files, so you can right-click on `RootCA.crt` > `Install` to open the import dialog.

Make sure to select "Trusted Root Certification Authorities" and confirm.

You should now get a green lock in Chrome, IE11 and Edge.

### Windows 10: Firefox

There are two ways to get the CA trusted in Firefox.

The simplest is to make Firefox use the Windows trusted Root CAs by going to `about:config`,
and setting `security.enterprise_roots.enabled` to `true`.

The other way is to import the certificate by going
to `about:preferences#privacy` > `Certificats` > `Import` > `RootCA.pem` > `Confirm for websites`.
