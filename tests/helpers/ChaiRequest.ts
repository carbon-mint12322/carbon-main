import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

export type URI = `/${string}`;

type ChaiParams = {
  host: `http://${string}:${string}`;
  uri: URI;
  method: 'put' | 'get' | 'post' | 'delete';
  payload?: object;
};

export async function ChaiRequest(params: ChaiParams): Promise<{ ok: boolean; body: any }> {
  const authToken = process.env.TEST_COOKIE_TOKEN || '';

  return new Promise((resolve, reject) => {
    ChaiReq(params)
      .set('Cookie', authToken)
      .send(params.payload ?? {})
      .end(async (err: any, res: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
  });
}

/** */
function ChaiReq({ host, uri, method }: ChaiParams) {
  const cleanedHost = host[host.length - 1] === '/' ? host.slice(0, -1) : host;

  // declared as function here, so that only when called it'll execute and create instance,
  // which saves memory
  const handlers = {
    get: () => chai.request(cleanedHost).get(uri),
    put: () => chai.request(cleanedHost).put(uri),
    post: () => chai.request(cleanedHost).post(uri),
    delete: () => chai.request(host).delete(uri),
  };

  if (!Object.keys(handlers).includes(method)) throw new Error('Method not allowed');

  return handlers[method]();
}
