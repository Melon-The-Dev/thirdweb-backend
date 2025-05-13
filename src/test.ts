//** THIRDWEB IMPORT * TYPES
import { Engine } from "@thirdweb-dev/engine";


export const engine: Engine = new Engine({
  url: "http://localhost:3005",
  accessToken: process.env.ACCESS_TOKEN || "",
  
});


export const createWallet = async (username: string = "Karl"): Promise<string> => {
	try {
		// Create a new backend wallet with the player's username as the label
		const wallet = await engine.backendWallet.create({ label: username, type: "smart:local" });

		// Extract the wallet address from the response
		const { walletAddress } = wallet.result;

		return walletAddress;
	} catch (error: any) {
		console.error("Error creating player wallet:", error);
		throw error;
	}
};

createWallet()