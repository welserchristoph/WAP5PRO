import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

const client = {
  id: 'client',
  grants: ['password', 'refresh_token'],
};

export default function oAuthModel(app) {
  const getDb = () => {
    const db = app.get('db');
    if (!db) throw new Error("Database not initialized");
    return db;
  };

  return {
    getClient: async (clientId, clientSecret) => {
      if (!clientId || clientId === 'client') {
        return client;
      }
      return false;
    },

    getUser: async (username, password) => {
      const db = getDb();
      const user = await db.collection('user_auth').findOne({ username });
      if (!user) return null;

      const passwordsMatch = await bcrypt.compare(password, user.password);
      return passwordsMatch ? user : null;
    },

    saveToken: async (token, client, user) => {
      const db = getDb();
      const profileId = user.user_id || user._id || user.id;

      await db.collection('token').insertOne({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        user_id: profileId
      });

      return { ...token, client, user };
    },

    getAccessToken: async (accessToken) => {
      const db = getDb();
      const token = await db.collection('token').findOne({ accessToken });
      if (!token) return null;

      token.client = client;
      token.user = await db.collection('user').findOne({ _id: token.user_id });

      return token;
    },

    getRefreshToken: async (refreshToken) => {
      const db = getDb();
      const token = await db.collection('token').findOne({ refreshToken });
      
      if (token) {
        token.client = client;
        const userId = typeof token.user_id === 'string' ? new ObjectId(token.user_id) : token.user_id;
        token.user = await db.collection('user').findOne({ _id: userId });
      }
  
      return token;
    },

    revokeToken: async (token) => {
      const db = getDb();
      const result = await db.collection('token').deleteOne({ 
        refreshToken: token.refreshToken 
      });
      return result.deletedCount === 1;
    }
  };
}