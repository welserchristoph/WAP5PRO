import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Definition des Clients (deiner App)
const client = {
  id: 'client',
  grants: ['password', 'refresh_token'],
};

export default function oAuthModel(db) {
  return {
    /**
     * CLIENT
     * schaut nach, ob der Client existiert
     */
    getClient: async (clientId, clientSecret) => {
      if (!clientId || clientId === 'client') {
        return client;
      }
      return false;
    },

    /**
     * LOGIN
     * wenn Benutzername und Passwort gesendet werden
     */
    getUser: async (username, password) => {
      const user = await db.collection('user_auth').findOne({ username });

      if (!user) return null;

      // passwordcheck
      const passwordsMatch = await bcrypt.compare(password, user.password);
      return passwordsMatch ? user : null;
    },

    /**
     * TOKEN SPEICHERN
     * Wird aufgerufen, wenn der Login erfolgreich war.
     * Erstellt das Dokument in der 'token' Collection.
     */
    saveToken: async (token, client, user) => {
      // Verknüpfung zum profil (user_id)
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

    /**
     * TOKEN VERIFIZIEREN 
     * Wird bei jedem geschützten API-Aufruf aufgerufen.
     * Prüft, ob das Token existiert und wer der Besitzer ist.
     */
    getAccessToken: async (accessToken) => {
      const token = await db.collection('token').findOne({ accessToken });
      if (!token) return null;

      token.client = client;
      token.user = await db.collection('user').findOne({ _id: token.user_id });

      return token;
    },

    /**
     * REFRESH TOKEN LADEN
     * Erlaubt es, ein neues Access Token zu erhalten, ohne sich neu einzuloggen.
     */
    getRefreshToken: async (refreshToken) => {
      // Suche das Token-Dokument
      const token = await db.collection('token').findOne({ refreshToken });
      
      if (token) {
        token.client = client; // Das Objekt 'client' von ganz oben

        const userId = typeof token.user_id === 'string' ? new ObjectId(token.user_id) : token.user_id;
        
        token.user = await db.collection('user').findOne({ _id: userId });

        // Kleiner Debug-Check für dich im Terminal:
        if (!token.user) {
          console.log("Refresh fehlgeschlagen: User wurde in der DB nicht gefunden!");
        } else {
          console.log("Refresh erfolgreich für User:", token.user || token.user_id.email);
        }
      }
  
  return token;
},

    /**
     * LOGOUT
     * Löscht das Refresh Token aus der Datenbank.
     */
    revokeToken: async (token) => {
      const result = await db.collection('token').deleteOne({ 
        refreshToken: token.refreshToken 
      });
      return result.deletedCount === 1;
    }
  };
}