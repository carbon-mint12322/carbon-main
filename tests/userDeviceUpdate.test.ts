require('dotenv').config();

import { before, describe } from 'mocha';
import chai, { assert } from 'chai';
import chaiHttp from 'chai-http';

import { connectDB, getModel } from '~/backendlib/db/adapter';
import fbMongoAdapter from '~/backendlib/middleware/adapters/FirebaseMongoAdapter';
import { IDbUser } from '~/backendlib/middleware/adapters/types';

chai.use(chaiHttp);

const User = {
  device: {
    info: new Date().toISOString(),
    fcmToken: new Date().toISOString(),
  },
};

const authToken = process.env.TEST_COOKIE_TOKEN || '';

describe('User device update test', () => {
  const host = 'http://localhost:3000';
  const UserModel = getModel('/farmbook/users');

  before(async () => {
    await connectDB();
    return;
  });

  it('Post empty device object, should get 422', (done) => {
    chai
      .request(host)
      .put(`/api/fb-mobile/user/update`)
      .set('Cookie', authToken)
      .send({
        device: {},
      })
      .end(async (err: any, res: any) => {
        try {
          assert.equal(422, res.status);
        } catch (e) {
          console.log();
        }
        done();
      });
  });

  it('Post only `info` in device object, should get 422', (done) => {
    chai
      .request(host)
      .put(`/api/fb-mobile/user/update`)
      .set('Cookie', authToken)
      .send({
        device: {
          info: '',
        },
      })
      .end(async (err: any, res: any) => {
        try {
          assert.equal(422, res.status);
        } catch (e) {
          console.log();
        }
        done();
      });
  });

  it('Post only `fcmToken` in device object, should get 422', (done) => {
    chai
      .request(host)
      .put(`/api/fb-mobile/user/update`)
      .set('Cookie', authToken)
      .send({
        device: {
          fcmToken: '',
        },
      })
      .end(async (err: any, res: any) => {
        try {
          assert.equal(422, res.status);
        } catch (e) {
          console.log();
        }
        done();
      });
  });

  it('Post empty object, should get 201 status code`', (done) => {
    chai
      .request(host)
      .put(`/api/fb-mobile/user/update`)
      .set('Cookie', authToken)
      .send({})
      .end(async (err: any, res: any) => {
        try {
          assert.equal(201, res.status);
        } catch (e) {
          console.log();
        }
        done();
      });
  });

  it('Post full valid device object, should get 201 status code`', (done) => {
    chai
      .request(host)
      .put(`/api/fb-mobile/user/update`)
      .set('Cookie', authToken)
      .send(User)
      .end(async (err: any, res: any) => {
        try {
          assert.equal(201, res.status);
        } catch (e) {
          console.log();
        }
        done();
      });
  });

  it('Get user object and check if it has the Device we saved`', async () => {
    let user: IDbUser | null;
    let isDeviceSaved: boolean = false;

    try {
      const [, userToken] = authToken.split('userToken=');

      const authUser = await fbMongoAdapter.verifyIdToken(userToken);

      const dbUser = await fbMongoAdapter.findDbUser(authUser);

      if (!dbUser?._id) throw new Error('Db user not valid.');

      user = await UserModel.get(dbUser?._id?.toString());

      if (!user) throw new Error('User not valid');

      isDeviceSaved = !!user.devices?.find((d) => d.fcmToken === User.device.fcmToken);
    } catch (e) {
      console.log(e);
    }

    assert.equal(true, isDeviceSaved);
    return;
  });
});
