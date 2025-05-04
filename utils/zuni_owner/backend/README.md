# DID Registry Backend

This is the backend for the DID Registry application, which interacts with a RegistryDID smart contract.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a .env file in the backend directory with the following variables:

   ```
   PORT=5000
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
   CONTRACT_ADDRESS=your_deployed_contract_address
   CORS_ORIGIN=http://localhost:3000
   ```

   Replace:

   - `your_private_key_here` with the private key of the account that deployed the contract
   - `your_infura_project_id` with your Infura project ID
   - `your_deployed_contract_address` with the address of your deployed contract

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

- `GET /api/health` - Check if the server is running
- `GET /api/waitingDIDs` - Get the list of waiting DIDs
- `GET /api/issuer/:did` - Get information about a specific issuer
- `POST /api/registerIssuer` - Register a new issuer
- `POST /api/acceptIssuer` - Accept a waiting issuer (only owner)
- `POST /api/declineIssuer` - Decline a waiting issuer (only owner)
- `POST /api/removeIssuer` - Remove an accepted issuer (only owner)

## Security Considerations

- The private key is stored in the .env file and should never be committed to version control
- Only the owner address can call the acceptIssuer, declineIssuer, and removeIssuer functions
