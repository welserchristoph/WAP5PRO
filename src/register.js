import express from 'express';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { isEmailValid } from './logic.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { email } = req.body;

    if (!isEmailValid(email)) {
      return res.status(400).json({ error: "Bitte gib eine gültige E-Mail-Adresse ein." });
    }

    const existingUser = await db.collection('user_auth').findOne({ username: email });

    if (existingUser) {
      return res.status(409).json({ error: "Diese E-Mail ist bereits registriert." });
    }

    const insertion = await db.collection('user_auth').insertOne({ username: email });

    if (insertion.acknowledged) {
      const token = v4();
      await db.collection('token').insertOne({
        emailToken: token,
        emailTokenExpiresAt: new Date(Date.now() + (1000 * 60 * 60)),
        user_id: insertion.insertedId,
      });

      console.log(`Activation link: http://localhost:3000/activate/${token}`);
      return res.status(201).json({ message: "Benutzer erfolgreich registriert" });
    } else {
      res.status(500).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.put('/:token', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { first_name, last_name, password } = req.body;

    if (!first_name || !last_name || !password) {
      return res.status(400).json({ error: "Daten fehlen." });
    }

    const token = await db.collection('token').findOne({ emailToken: req.params.token });

    if (token) {
      const insertion = await db.collection('user').insertOne({
        first_name,
        last_name,
        permissions: { write: false },
      });

      if (insertion.acknowledged) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updated = await db.collection('user_auth').updateOne(
          { _id: token.user_id },
          { $set: { password: hashedPassword, user_id: insertion.insertedId } }
        );

        if (updated.modifiedCount === 1) {
          await db.collection('token').deleteOne({ emailToken: req.params.token });
          res.status(200).send();
        } else {
          res.status(500).send();
        }
      } else {
        res.status(500).send();
      }
    } else {
      res.status(401).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

export default router;