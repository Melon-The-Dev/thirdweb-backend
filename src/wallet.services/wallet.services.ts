//** THIRDWEB IMPORT * TYPES
import { Engine } from "@thirdweb-dev/engine";



export const engine: Engine = new Engine({
  url: "http://localhost:3005",
  accessToken: process.env.ACCESS_TOKEN || '',
  
});

class WalletService {



  //** Creates a wallet and returns the wallet address.
  public async createWallet(username: string): Promise<string> {
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
   }




}

export default WalletService;