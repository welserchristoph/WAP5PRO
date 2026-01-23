import express from 'express';
import { ObjectId } from 'mongodb';
import { validateBookingDates, filterAvailableCameras, calculateTotalPrice } from './logic.js';

const router = express.Router(); 

router.get('/cameras', async (req, res) => {
  try {
    const db = req.app.get('db'); 
    const allCameras = await db.collection('cameras').find({}).toArray(); 

    const availableCameras = filterAvailableCameras(allCameras);

    res.json(availableCameras); 
  } catch (err) {
    res.status(500).send(); 
  }
});


router.get('/cameras/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const camera = await db.collection('cameras').findOne({ _id: new ObjectId(req.params.id) }); 
    
    if (camera) {
      res.json(camera); 
    } else {
      res.status(404).send(); 
    }
  } catch (err) {
    res.status(500).send(); 
  }
});

router.get('/bookings/camera/:cameraId', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { cameraId } = req.params;
    
    const bookings = await db.collection('bookings')
      .find({ cameraId: new ObjectId(cameraId) })
      .toArray();
      
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fehler beim Laden der Kalenderdaten" });
  }
});

router.get('/my-bookings', async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const oauthUser = res.locals.oauth.token.user;

    if (!oauthUser) {
      return res.status(401).json({ error: "Nicht autorisiert" });
    }

    const myBookings = await db.collection('bookings')
      .find({ userId: new ObjectId(oauthUser._id) })
      .toArray();
      
    res.json(myBookings);
  } catch (err) {
    console.error("Fehler bei my-bookings:", err);
    res.status(500).json({ error: "Fehler beim Laden deiner Buchungen" });
  }
});

router.post('/bookings', async (req, res) => {
  try {
    const db = req.app.get('db');
    const { cameraId, startDate, endDate, totalPrice, cameraName } = req.body;
    const oauthUser = res.locals.oauth.token.user;

    if (!oauthUser) return res.status(401).json({ error: "Nicht autorisiert" });

      let dates;
      let calculatedPrice;
    try {
     

      dates = validateBookingDates(startDate, endDate);

      const camera = await db.collection('cameras').findOne({ _id: new ObjectId(cameraId) });
      if (!camera) return res.status(404).json({ error: "Kamera nicht gefunden" });

      calculatedPrice = calculateTotalPrice(camera.daily_rate, startDate, endDate);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    const { start, end } = dates;

    const existingBooking = await db.collection('bookings').findOne({
      cameraId: new ObjectId(cameraId), 
      $and: [
        { startDate: { $lt: end } },
        { endDate: { $gt: start } } 
      ]
    });

    if (existingBooking) {
      return res.status(409).json({ 
        error: "Die Kamera ist in diesem Zeitraum bereits gebucht." 
      });
    }

    const newBooking = {
      userId: new ObjectId(oauthUser._id),
      cameraId: new ObjectId(cameraId),
      cameraName,
      startDate: start,
      endDate: end,
      calculatedPrice,
      status: "confirmed",
      bookedAt: new Date()
    };

    const result = await db.collection('bookings').insertOne(newBooking);
    res.status(201).json({ message: "Erfolgreich gebucht!", bookingId: result.insertedId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Serverfehler bei der Buchung" });
  }
});

export default router; 