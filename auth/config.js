import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import getDbUser from './getDbUser';

import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyIdToken } from '~/backendlib/middleware/verify-token';
import { Console } from 'console';

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      credentials: {
        firebaseToken: { label: 'Firebase token', type: 'text', placeholder: 'token' },
        pin: { label: 'Pin', type: 'number', placeholder: 'Pin' },
        mobile: { label: 'Mobile', type: 'text', placeholder: 'Mobile' },
      },
      async authorize(credentials, req) {
        try {
          const { firebaseToken, pin, mobile } = credentials;
          if (firebaseToken) {
            const decodedToken = await verifyIdToken(firebaseToken);
            const user = decodedToken;
            const dbUser = await getDbUser('', user.phone_number || mobile);
            if (dbUser) {
              // Any object returned will be saved in `user` property of the JWT
              return { ...dbUser, phone_number: dbUser?.personalDetails?.primaryPhone };
            } else {
              // If you return null then an error will be displayed advising the user to check their details.
              return null;
              // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
          } else {
            const dbUser = await getDbUser('', mobile);
            if (dbUser && dbUser.pin && dbUser.pin === pin) {
              return { ...dbUser, phone_number: dbUser?.personalDetails?.primaryPhone };
            }
            return null;
          }
        } catch (error) {
          console.log(error, ' Error while signin');
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    }),
  ],
  jwt: {
    encryption: true,
    maxAge: 60 * 60 * 24 * 365,
  },
  secret: process.env.COOOKIE_SECRET || 'secret token',

  callbacks: {
    async jwt(jwtCbInput) {
      if (!jwtCbInput) {
        return null;
      }
      const { token, user, account } = jwtCbInput;
      if (account) {
        token.accessToken = account.accessToken;
        if (user.roles) {
          token.roles = user.roles;
          token.userId = user._id.toString();
          token.name = user?.personalDetails?.firstName + ' ' + user?.personalDetails?.lastName;
          token.email = user?.personalDetails?.email;
        } else if (user?.user?.roles) {
          token.roles = user?.user?.roles;
          token.userId = user?.user?._id.toString();
          token.name =
            user?.user?.personalDetails?.firstName + ' ' + user?.user?.personalDetails?.lastName;
          token.email = user?.user?.personalDetails?.email;
        } else {
          const [userId, roles] = (await getRoles(user)) || [];
          token.roles = roles;
          token.userId = userId;
        }
      }
      const resp = { ...token, ...user };
      return resp;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token?.roles) {
        session.user.roles = token.roles;
      }
      if (token?.phone_number) {
        session.user.phone_number = token.phone_number;
      }
      return session;
    },

    /*
      redirect: async (url, _baseUrl) => {
        if (url === "/user") {
          return Promise.resolve("/");
        }
        return Promise.resolve("/");
      },
      */
  },
  pages: {
    error: '/public/login',
    signIn: '/public/login',
  },
};

async function getRoles(oauthUser) {
  const _dbuser = await getDbUser(oauthUser.email, oauthUser.phone_number);
  if (!_dbuser) {
    console.log('No user found in db');
    return null;
  }
  const dbuser = _dbuser.data ? _dbuser.data : _dbuser;
  const roles = dbuser.roles;
  // const injected = maybeInjectSimulatedRoles(roles);
  // const derivedRoles = deriveRolesFromDbRoles(injected);
  return [dbuser.id || dbuser._id, roles];
}

export default NextAuth(authOptions);
