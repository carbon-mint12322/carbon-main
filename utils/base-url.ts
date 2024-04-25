// Construct a Base URL given a request object.
// Used to generate URLs for maps etc.

const localRe = /localhost.*/;
const protocol = (req: any) => (localRe.test(req.headers.host) ? 'http' : 'https');
const host = (req: any) => req.headers.host;
const baseUrl = (req: any) => `${protocol(req)}://${host(req)}`;

export default baseUrl;
