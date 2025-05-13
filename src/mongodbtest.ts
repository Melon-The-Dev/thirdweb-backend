import { mongoDBClient } from "./mongodb";

async function testInsertUser() {
	try {
		await mongoDBClient.connect();
		

		const db = mongoDBClient.db("test");

		const collections = await db.listCollections({ name: "users" }).toArray();
		if (collections.length === 0) {
			await db.createCollection("users");
			console.log("✅ Created 'users' collection in 'test' database.");
		}

		// Insert a user document
		const usersCollection = db.collection("users");
		const user = {
			username: "testuser",
			password: "securepassword123",
			createdAt: new Date(),
		};

		const result = await usersCollection.insertOne(user);
		console.log("✅ User inserted successfully:", result.insertedId);
	} catch (err) {
		console.error("Error inserting user:", err);
	} finally {
		await mongoDBClient.close();
	}
}

testInsertUser();