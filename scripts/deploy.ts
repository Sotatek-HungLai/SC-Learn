import { ethers } from "hardhat";
import * as Config from "./config";
import { config } from "dotenv";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const token = await ethers.deployContract("TokenLearn");
  console.log("Token address:", await token.getAddress());
  await Config.setConfig("token.TokenLearn.address", await token.getAddress());

  // const testERC4626 = await ethers.getContractFactory("TokenLearnVault");
  // const vault = await testERC4626.deploy(
  //   await Config.readValue("token.TokenLearn.address") || ""
  // );
  // console.log("Vault address:", await vault.getAddress());
  // await Config.setConfig("token.vault.address", await vault.getAddress());

  // const learn = await ethers.deployContract("NFTLearn");
  // console.log("NFTLearn address:", await learn.getAddress());
  // await Config.setConfig("nft.NFTLearn.address", await learn.getAddress());

  // const NFTLearnVault = await ethers.getContractFactory("NFTLearnVault");
  // const vault = await NFTLearnVault.deploy(
  //   (await Config.readValue("nft.NFTLearn.address")) || ""
  // );
  // console.log("NFTLearnVault address:", await vault.getAddress());
  // await Config.setConfig("nft.vault.address", await vault.getAddress());

  // const balanceContract = await ethers.deployContract("BalanceContract");
  // console.log("BalanceContract address:", await balanceContract.getAddress());
  // await Config.setConfig(
  //   "BalanceContract.address",
  //   await balanceContract.getAddress()
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
