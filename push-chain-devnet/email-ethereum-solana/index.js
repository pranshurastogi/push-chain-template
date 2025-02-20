// Import Push Chain SDK for blockchain interactions
const { PushChain, CONSTANTS, createUniversalSigner, createUniversalAccount } = require('@pushchain/devnet');

// Import ethers.js and viem for signing
const { ethers } = require('ethers');
const { hexToBytes } = require('viem');

// Generate a new private key using ethers.js
const wallet = ethers.Wallet.createRandom();
console.log('Generated Private Key:', wallet.privateKey);
console.log('Wallet Address:', wallet.address);

// Create an account object similar to viem's `privateKeyToAccount`
const account = {
  address: wallet.address,
  signMessage: async ({ message }) => {
    const signature = await wallet.signMessage(message.raw);
    return signature;
  },
};

// Create a signer
const signer = createUniversalSigner({
  address: account.address,
  signMessage: async (data) =>
    hexToBytes(await account.signMessage({ message: { raw: data } })),
});

console.log('Signer created:', signer);


// Initialize PushChain
(async () => {
  const pushChain = await PushChain.initialize(signer);
  console.log('PushChain initialized');

  // Send transaction
  const tx = await pushChain.tx.send(
    [
      createUniversalAccount({
        chain: CONSTANTS.CHAIN.SOLANA,
        chainId: CONSTANTS.CHAIN_ID.SOLANA.DEVNET,
        address: 'ySYrGNLLJSK9hvGGpoxg8TzWfRe8ftBtDSMECtx2eJR',
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

  // Wait for transaction processing
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Fetch the transaction by its hash
  const results = await pushChain.tx.get(tx.txHash);
  console.log('Fetched Transaction Results:', results);

  for (const blocks of results.blocks) {
    for (const t of blocks.transactions) {
      console.log('Transaction Data:', t.data);
    }
  }
})();
