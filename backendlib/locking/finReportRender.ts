import renderView from '~/gen/templated-views';

const reportName = 'finReport';

async function qrRender(domainSchemaId: string, mustacheData: any): Promise<string> {
  return renderView(domainSchemaId)(reportName)(mustacheData);
}

export default qrRender;
