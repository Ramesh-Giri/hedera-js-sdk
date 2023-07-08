console.clear();
require('dotenv').config();


const { Client, PrivateKey, AccountCreateTransaction,TokenMetadataTransaction, AccountBalanceQuery,ContractCreateFlow, Hbar, TransferTransaction, TokenCreateTransaction, TokenAssociateTransaction, AccountId, FileCreateTransaction,ContractCreateTransaction,FileUpdateTransaction, PublicKey } = require("@hashgraph/sdk");
const fs = require('fs');

async function main() {


  try {
    const contractBytecode = fs.readFileSync("apu_sol_APUToken.bin");

    //Grab your Hedera testnet account ID and private key from your .env file
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorPublicKey = PublicKey.fromString(process.env.MY_PUBLIC_KEY);
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);


//Create your Hedera Testnet client
const client = Client.forTestnet().setOperator(operatorId, operatorKey);
    
const contractCreate = new ContractCreateFlow()
.setGas(500000)
.setBytecode(contractBytecode);

const txResponse = await contractCreate.execute(client);

const receipt = await txResponse.getReceipt(client);
const newContractId = receipt.contractId;

console.log("The new contract ID is", newContractId.toString());

 
// Step 3: Create a new HTS Token
var createTokenTx = await new TokenCreateTransaction()
.setTokenName('Ramesh Token')
.setTokenSymbol("RG")
.setDecimals(0)
.setInitialSupply(50000000000)
.setTreasuryAccountId(operatorId)
.execute(client);


var createReceipt = await createTokenTx.getReceipt(client);
var newTokenId = createReceipt.tokenId;

console.log('new token Id :', newTokenId.toString());

// Grab 2nd account from out environment file
// const account2Id = AccountId.fromString(process.env.MY_ACCOUNT_ID);
// const account2Key = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

//Associate new accout with the new token

// var associateTx = await new TokenAssociateTransaction()
// .setAccountId(account2Id)
// .setTokenIds([newTokenId])
// .freezeWith(client)
// .sign(account2Key);

// var submitAssociateTx = await associateTx.execute(client);
// var associateReceipet = await submitAssociateTx.getReceipt(client);


// console.log('Associate tx receipet :' , associateReceipet);

// await linkImageWithToken(client, newTokenId.toString(), "https://lh3.googleusercontent.com/pw/AJFCJaWakkiaIqO1S-WHdk9R5afRTEIhp0R8vd8ZFKRd1VxTUkHO5D2vhwQmNAQEWYPB0C05qyw2oqOuou77PpZx7uKPG243sOELeTJOnwvFKvvI8r3vWSGl_5G7I5ppo-5wvz9NEv35fJlDDNjyl8xqnl8swQ=w1108-h1115-s-no");


// //TRANSFER tokens from "treasury" to 2nd account

// var transfeTx = await new TransferTransaction()
// .addTokenTransfer(newTokenId, operatorId, -10) // decuct 10 tokens from treasury.
// .addTokenTransfer(newTokenId, account2Id, 10) // increase by 10 tokens
// .execute(client);

// var transderREceipt = await transfeTx.getReceipt(client);

// console.log('Transfer tx receipet :', transderREceipt);

//check the balanace of out accounts

//var accountBalance = await new AccountBalanceQuery().setAccountId(operatorId).execute(client);

//console.log('Account 1 balance :', accountBalance.tokens.toString());
} catch (error) {
  console.error("An unknown error occurred:", error);
}

}


async function linkImageWithToken(client, tokenId, imageUrl) {
  // Create a new file to store the image
  const fileCreateTx = await new FileCreateTransaction().setContents(imageUrl).setMaxTransactionFee(new Hbar(2)).execute(client);
  const fileCreateReceipt = await fileCreateTx.getReceipt(client);
  const fileId = fileCreateReceipt.fileId;

  // Update the token metadata to link the image
  const metadataUpdateTx = await new TokenUpdateTransaction()
      .setTokenId(tokenId)
      .setFileId(fileId)
      .freezeWith(client);

  // Sign and execute the transaction
  const metadataUpdateTxSigned = await metadataUpdateTx.sign(operatorKey);
  const metadataUpdateTxResponse = await metadataUpdateTxSigned.execute(client);
  const metadataUpdateReceipt = await metadataUpdateTxResponse.getReceipt(client);

  console.log("Token metadata updated with image:", metadataUpdateReceipt.status.toString());
}

  main().catch((err) => {
    console.error(err);
});