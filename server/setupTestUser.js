import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export default async function setupTestUser(db) {
    const email = "testuser@example.com";
    const testCameraId = new ObjectId("65ae1234567890abcdef1234");

    const existingAuth = await db.collection("user_auth").findOne({ username: email });

    if (!existingAuth) {
        const passwordHash = await bcrypt.hash("test12345", 10);

        const authResult = await db.collection("user_auth").insertOne({
            username: email,
            password: passwordHash,
            createdAt: new Date(),
        });

        await db.collection("user").insertOne({
            _id: authResult.insertedId, 
            first_name: "Test",
            last_name: "User",
            email: email,
            permissions: { write: true },
        });

        console.log("Test-User und Profil erfolgreich angelegt.");
    }
    const existingCamera = await db.collection("cameras").findOne({ _id: testCameraId });
    if (!existingCamera) {
        await db.collection("cameras").insertOne({
            _id: testCameraId,
            name: "Sony FX3",
            status: "available",
            daily_rate: 150
        });
        console.log("Test-Kamera wurde angelegt.");
    }
}