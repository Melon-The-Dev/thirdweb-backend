import { mongoDBClient } from "../mongodb";
import { compare, hash } from "bcrypt-ts";
import type { userRegistration, userLoginResponse, userLogin } from "../types/types";
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

	public async login(loginData: userLogin): Promise<userLoginResponse> {
		const { username, password } = loginData;

		const db = mongoDBClient.db("decentragri");
		const usersCollection = db.collection("users");

		const tokenService = new TokenService();
		const walletService = new WalletService();

		try {

			const user = await usersCollection.findOne({ username });

			if (!user) {
				throw new Error("Invalid username or password");
			}

			// Validate password
			const isPasswordValid = await compare(password, user.password);
			if (!isPasswordValid) {
				throw new Error("Invalid username or password");
			}

			const [tokens, ] = await Promise.all([
				tokenService.generateTokens(username),

			]);

			const { accessToken, refreshToken } = tokens;

			return {
				username,
				walletAddress: user.walletAddress,
				accessToken,
				refreshToken,
				loginType: "decentragri",

			};
		} catch (error: any) {
			console.error("Error logging in:", error);
			throw new Error("Failed to log in");
		}
	}
}

export default AuthService;