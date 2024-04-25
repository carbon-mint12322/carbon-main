const fs = require('fs');
const Mustache = require('mustache');

async function handleRender() {
  const Template = fs
    .readFileSync('/Users/manoj/Code/carbonmint/reactml/tools/templates/html/QR.mustache')
    .toString();

  const Json = require('/Users/manoj/Code/carbonmint/reactml/mustacheRendereredOutput/mustacheRendered.json');

  // render the data into the template
  const rendered = Mustache.render(Template, Json);

  fs.writeFileSync(
    '/Users/manoj/Code/carbonmint/reactml/mustacheRendereredOutput/mustacheRendered.html',
    rendered,
  );
}

handleRender().then();

export {};
