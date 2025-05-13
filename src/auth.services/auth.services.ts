import { mongoDBClient } from "../mongodb";
import { hash } from "bcrypt-ts";
import type { userRegistration, userLoginResponse } from "../types/types";
import TokenService from "../security.services/token.service";
import WalletService from "../wallet.services/wallet.services";

class AuthService {
	public async register(user: userRegistration): Promise<userLoginResponse> {
		const { username, password, deviceId } = user;

		const walletService = new WalletService();
		const tokenService = new TokenService();

		const db = mongoDBClient.db("decentragri"); // Use your DB name
		const usersCollection = db.collection("users");

		try {
			// Check if username already exists
			const existingUser = await usersCollection.findOne({ username });
			if (existingUser) {
				throw new Error(`An account already exists with the username "${username}"`);
			}

			// Parallelize password hashing and wallet creation
			const [encryptedPassword, walletAddress] = await Promise.all([
				hash(password, parseInt("10")),
				walletService.createWallet(username),
			]);

			const userId = crypto.randomUUID(); // or any unique ID generator

			await usersCollection.insertOne({
				userId,
				username,
				password: encryptedPassword,
				deviceId,
				walletAddress,
				createdAt: new Date()
			});

			// Generate tokens after user creation
			const [tokens] = await Promise.all([
                tokenService.generateTokens(username),
            ]);

			const { accessToken, refreshToken } = tokens;

			return {
				username,
				walletAddress,
				accessToken,
				refreshToken,
				loginType: "decentragri"
			};
		} catch (error: any) {
			console.error("Error registering user:", error);
			throw new Error("Failed to register user");
		}
	}
}

export default AuthService;