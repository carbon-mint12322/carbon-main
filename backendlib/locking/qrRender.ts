import renderView from '~/gen/templated-views';

const reportName = 'qr';

async function qrRender(domainSchemaId: string, mustacheData: any): Promise<string> {
  var domainSchemaIdTemp: any = domainSchemaId.split('/');
  domainSchemaIdTemp = domainSchemaIdTemp[domainSchemaIdTemp.length - 1];
  return renderView(domainSchemaIdTemp)(reportName)(mustacheData);
}

export default qrRender;
