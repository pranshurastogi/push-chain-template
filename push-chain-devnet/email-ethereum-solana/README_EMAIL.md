# Push Chain Transaction Template

This repository provides a **template for interacting with Push Chain**, enables you to send message through your Ethereum and Solana address. The code demonstrates how to:
- **Generate an Ethereum wallet** using `ethers.js`
- **Sign messages and transactions** securely
- **Send a cross-chain transaction** to a Solana address
- **Fetch and verify the transaction status**

## Features
- ✅ **Push Chain SDK Integration** for multi-chain transactions
- ✅ **Automatic wallet generation** for Ethereum
- ✅ **Message signing** using `ethers.js`
- ✅ **Transaction tracking and verification**

## Setup & Installation
### **1️⃣ Clone the Repository**
```sh
 git clone https://github.com/pranshurastogi/push-chain-template.git
 cd push-chain-template/push-chain-devnet/email-ethereum-solana
```

### **2️⃣ Install Dependencies**
```sh
npm install @pushchain/devnet viem ethers
```

### **3️⃣ Run the Script**
```sh
node index.js
```

## 🔹 Code Breakdown

### **1️⃣ Initiation: Setting Up Push Chain & Wallet**
```js
const { PushChain, CONSTANTS, createUniversalSigner, createUniversalAccount } = require('@pushchain/devnet');
const { ethers } = require('ethers');
const { hexToBytes } = require('viem');

const wallet = ethers.Wallet.createRandom();
console.log('Generated Private Key:', wallet.privateKey);
console.log('Wallet Address:', wallet.address);
```
- Creates a **new Ethereum wallet** for signing transactions.
- Logs the generated **private key and wallet address**.

### **2️⃣ Signing: Authenticate Transactions**
```js
const account = {
  address: wallet.address,
  signMessage: async ({ message }) => {
    return await wallet.signMessage(message.raw);
  },
};
const signer = createUniversalSigner({
  address: account.address,
  signMessage: async (data) => hexToBytes(await account.signMessage({ message: { raw: data } })),
});
console.log('Signer created:', signer);
```
- Converts the Ethereum wallet into a **signing account**.
- Uses `createUniversalSigner()` to enable **cross-chain compatibility**.

### **3️⃣ Broadcasting: Sending the Transaction**
```js
(async () => {
  const pushChain = await PushChain.initialize(signer);
  console.log('PushChain initialized');

  const tx = await pushChain.tx.send(
    [
      createUniversalAccount({
        chain: CONSTANTS.CHAIN.SOLANA,
        chainId: CONSTANTS.CHAIN_ID.SOLANA.DEVNET,
        address: 'SOLANA ADDRESS OF YOUR FRIEND',
      }),
    ],
    {
      category: 'EMAIL',
      data: JSON.stringify({
        title: 'Hello old friend from Solana!',
        message: 'Greetings from Ethereum world.',
      }),
    }
  );
  console.log('Transaction sent. TX Hash:', tx.txHash);
```
- **Initializes Push Chain** and sends a transaction to a Solana address.
- The transaction contains a **message payload**, demonstrating **cross-chain communication**.

### **4️⃣ Validation & Finalization: Fetching Transaction Data**
```js
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const results = await pushChain.tx.get(tx.txHash);
  console.log('Fetched Transaction Results:', results);
  for (const blocks of results.blocks) {
    for (const t of blocks.transactions) {
      console.log('Transaction Data:', t.data);
    }
  }
})();
```
- Waits for **5 seconds** to allow the transaction to process.
- Fetches the **transaction results** and logs the stored data.

## 📜 Transaction Lifecycle
| **Stage**       | **Description** |
|-----------------|----------------|
| **Initiation**  | Setting up Push Chain & generating the wallet |
| **Signing**     | Ensuring transaction authenticity via signing |
| **Broadcasting** | Sending the signed transaction to the network |
| **Validation**  | Network verifies the transaction |
| **Finalization** | Fetch and store transaction details |

## 🚀 Next Steps
- **Modify transaction payloads** (e.g., sending other types of messages)
- **Integrate with frontend apps** for a complete dApp experience

## 📌 Repository
- **GitHub:** [Push Chain Template](https://github.com/pranshurastogi/push-chain-template)

💡 **For any issues or feature requests, feel free to open a PR or raise an issue!** 🚀

