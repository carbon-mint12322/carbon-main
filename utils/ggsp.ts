import { menuGssp } from '~/frontendlib/util';

export default async function getServerSideProps(context: any) {
  const permittedRoles = ['AGENT', 'FARMER'];
  return menuGssp(datasource, permittedRoles, context);
}

// Data source - The data returned here will be used as formData in RJSF
// you may populate defaults here for example
const datasource: any = async (context: any) => ({});
