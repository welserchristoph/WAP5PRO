import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const uri = process.env.MONGODB_CONNECTION_STRING;
  
  if (!uri) {
    console.error("Fehler: MONGODB_CONNECTION_STRING nicht in .env gefunden.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    
    const db = client.db('CameraRental'); 
    const cameraCollection = db.collection('cameras');

    const cameras = [
      {
        _id: new ObjectId("69698266e6594066a9c3924f"),
        name: "VENICE 2",
        brand: "Sony",
        type: "Cine Alta",
        daily_rate: 1100,
        sensor: "Full Frame",
        resolution: "8.6K",
        mount: "PL/E",
        status: "available",
        description: "Hervorragende Farbwiedergabe und Dual Base ISO.",
        image: "http://localhost:3000/images/sony_venice2.jpg"
      },
      {
        _id: new ObjectId("69698266e6594066a9c39250"),
        name: "URSA Mini Pro 12K",
        brand: "Blackmagic",
        type: "Digital Film",
        daily_rate: 250,
        sensor: "Super 35",
        resolution: "12K",
        mount: "PL",
        status: "available",
        description: "Preis-Leistungs-Monster für High-Res Aufnahmen.",
        image: "http://localhost:3000/images/bm_ursa.jpg"
      },
      {
        _id: new ObjectId("69698266e6594066a9c39251"),
        name: "Millennium DXL2",
        brand: "Panavision",
        type: "Premium Cine",
        daily_rate: 1500,
        sensor: "RED Monstro 8K VV",
        resolution: "8K",
        mount: "PV",
        status: "available",
        description: "Exklusive Kamera mit dem legendären Panavision-Look.",
        image: "http://localhost:3000/images/pv_millennium.jpg"
      },
      {
        _id: new ObjectId("69698266e6594066a9c3924e"),
        name: "V-Raptor XL",
        brand: "RED",
        type: "High Speed Cine",
        daily_rate: 950,
        sensor: "VistaVision",
        resolution: "8K",
        mount: "PL",
        status: "available",
        description: "Extremer Dynamikumfang und bis zu 120 fps bei 8K.",
        image: "http://localhost:3000/images/red_raptor.jpg"
      },
      {
        _id: new ObjectId("69698266e6594066a9c3924d"),
        name: "Alexa Mini LF",
        brand: "Arri",
        type: "Large Format Cine",
        daily_rate: 1200,
        sensor: "Full Frame",
        resolution: "4.5K",
        mount: "LPL",
        status: "available",
        description: "Der Goldstandard für Spielfilmproduktionen.",
        image: "http://localhost:3000/images/arri_alexa.jpg"
      },
      {
        _id: new ObjectId("678e8b2f4a1c5d001f3e9a7c"),
        name: "FX3",
        brand: "Sony",
        type: "Cinema Line",
        daily_rate: 150,
        sensor: "Full Frame",
        resolution: "4K",
        mount: "E-Mount",
        status: "available",
        description: "Kompakte Cinema-Kamera mit herausragendem Autofokus und Low-Light-Performance. Ideal für Run-and-Gun-Produktionen.",
        image: "http://localhost:3000/images/sony_fx3.jpg"
      }
    ];

    await cameraCollection.deleteMany({});
    
    await cameraCollection.insertMany(cameras);
    
    console.log("--------------------------------------------------");
    console.log("SEEDING ERFOLGREICH");
    console.log(`Datenbank: CameraRental`);
    console.log(`Collection: cameras`);
    console.log(`Kameras importiert: ${cameras.length}`);
    console.log("--------------------------------------------------");

  } catch (err) {
    console.error("Fehler beim Seeding:", err);
  } finally {
    await client.close();
  }
}

seedDatabase();