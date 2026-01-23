import request from 'supertest';
import { jest, expect, test, describe, beforeEach } from '@jest/globals';
import { ObjectId } from 'mongodb';
import app from '../app.js';
import { 
    validateBookingDates, 
    calculateTotalPrice, 
    isEmailValid, 
    filterAvailableCameras 
} from './logic.js';
import setupTestUser from './setupTestUser.js';

let accessToken;

beforeAll(async () => {
    const db = app.get('db');
    if (!db) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const connectedDb = app.get('db');
    await setupTestUser(connectedDb);

    const res = await request(app)
        .post("/api/token")
        .type("form")
        .send({
            grant_type: "password",
            client_id: "client",
            username: "testuser@example.com",
            password: "test12345",
        });

    accessToken = res.body.access_token;
});

afterAll(async () => {
    const db = app.get('db');
    if (db && db.client) {
        await db.collection('bookings').deleteMany({ userId: app.get('testUserId') }); 
        
        await db.collection('user_auth').deleteOne({ username: "testuser@example.com" });
        await db.collection('user').deleteOne({ email: "testuser@example.com" });
        await db.collection('cameras').deleteOne({ _id: new ObjectId("65ae1234567890abcdef1234") });
        
        console.log("Cleanup: Testdaten wurden aus der DB entfernt.")
        await db.client.close();
    }
});

describe('API Integration (Protected Routes)', () => {
    test('Sollte Zugriff auf /api/cameras mit Token erlauben', async () => {
        const res = await request(app)
            .get("/api/cameras")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('Sollte Zugriff ohne Token verweigern (401)', async () => {
        const res = await request(app).get("/api/cameras");
        expect(res.statusCode).toBe(401);
    });
    test('POST /api/bookings sollte eine Buchung erfolgreich erstellen', async () => {
        const testBooking = {
            cameraId: "65ae1234567890abcdef1234", 
            cameraName: "Sony FX3",
            startDate: "2026-07-01",
            endDate: "2026-07-05",
            totalPrice: 600
        };

        const res = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(testBooking);

        if (res.statusCode === 400) console.log("Backend-Fehler:", res.body.error);
        expect([201, 409]).toContain(res.statusCode);
        
        if (res.statusCode === 201) {
            expect(res.body).toHaveProperty("message", "Erfolgreich gebucht!");
            expect(res.body).toHaveProperty("bookingId");
        }
    });

    test('POST /api/bookings sollte ohne Token 401 liefern', async () => {
        const res = await request(app)
            .post("/api/bookings")
            .send({ cameraId: "123" });

        expect(res.statusCode).toBe(401);
    });
});

describe('function validateBookingDates(startDate, endDate)', () => {
  
  test('sollte gültige Date-Objekte zurückgeben, wenn die Eingabe korrekt ist', () => {
    const startStr = '2026-06-01';
    const endStr = '2026-06-05';
    
    const result = validateBookingDates(startStr, endStr);
    
    expect(result.start).toBeInstanceOf(Date); 
    expect(result.end).toBeInstanceOf(Date); 
    expect(result.start.toISOString()).toContain(startStr);
  });

  test('sollte einen Fehler werfen, wenn das Enddatum vor dem Startdatum liegt', () => {
    expect(() => { 
      validateBookingDates('2026-06-10', '2026-06-01'); 
    }).toThrow('Enddatum muss nach dem Startdatum liegen');
  });

  test('sollte einen Fehler werfen, wenn kein gültiges Datum übergeben wird', () => {
    expect(() => { 
      validateBookingDates('kein-datum', '2026-06-05'); 
    }).toThrow('Ungültiges Datum');
  });
});
    describe('calculateTotalPrice()', () => {
        test('sollte den Preis für 2 Tage korrekt berechnen (2 x 150 = 300)', () => {
            const price = calculateTotalPrice(150, '2026-06-01', '2026-06-03');
            expect(price).toBe(300);
        });

        test('sollte bei ungültigem Tagespreis (z.B. negativ) einen Fehler werfen', () => {
            expect(() => calculateTotalPrice(-10, '2026-06-01', '2026-06-03'))
                .toThrow('Ungültiger Tagespreis');
        });
    });

    describe('isEmailValid()', () => {
        test('sollte true für valide E-Mail zurückgeben', () => {
            expect(isEmailValid('test@example.com')).toBe(true);
        });

        test('sollte false zurückgeben, wenn das @-Zeichen fehlt', () => {
            expect(isEmailValid('testexample.com')).toBe(false); 
        });
    });

    describe('GET Logic: filterAvailableCameras()', () => {
    
    test('sollte nur Kameras mit Status "available" zurückgeben', () => {
        const mockData = [
            { name: 'Sony FX3', status: 'available' },
            { name: 'Arri Alexa', status: 'maintenance' },
            { name: 'Canon R5', status: 'available' }
        ];
        
        const result = filterAvailableCameras(mockData);
        
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Sony FX3');
        expect(result[1].name).toBe('Canon R5');
    });

    test('sollte ein leeres Array zurückgeben, wenn keine Kamera verfügbar ist', () => {
        const mockData = [{ name: 'Sony FX3', status: 'unavailable' }];
        const result = filterAvailableCameras(mockData);
        expect(result).toHaveLength(0);
    });

    test('sollte einen Fehler werfen, wenn die Eingabe kein Array ist', () => {
        expect(() => filterAvailableCameras(null)).toThrow('Ungültiges Datenformat: Array erwartet');
    });
});

