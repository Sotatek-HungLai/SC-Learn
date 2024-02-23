require("dotenv").config();

import * as Config from "./config";
import { NFTStorage, File } from "nft.storage";
import fs, { readFileSync } from "fs";
import path from "path";
import { ethers } from "hardhat";
import { NFTLearn } from "../typechain-types/contracts/NFTLearn";
import mime from "mime-types";
import { Address } from "../typechain-types";
import { ContractTransactionReceipt } from "ethers";

const apiKey = process.env.NFT_STORAGE_KEY || "";

const nftStorage = new NFTStorage({
  token: apiKey,
});

export async function storeNFT({
  filePath,
  name = "",
  description,
}: {
  filePath: string;
  name?: string;
  description: string;
}) {
  const image = await fileFromPath(filePath);
  console.log("Upload file: ", image.name);
  const metadata = await nftStorage.store({
    image,
    name: name || image.name,
    description,
  });

  return metadata;
}

export async function fileFromPath(filePath: string) {
  const fullPath = path.join(__dirname, "assets", filePath);
  const content = await fs.promises.readFile(fullPath);

  const type = mime.lookup(fullPath) || "unknown";
  return new File([content.buffer], path.basename(filePath), { type });
}

export async function mintNFT({
  to,
  contract,
  filePath,
  name = "",
  description = "",
}: {
  to: string;
  contract: NFTLearn;
  filePath: string;
  name: string;
  description: string;
  // ...
}) {
  const metaData = await storeNFT({
    filePath,
    name,
    description,
  });

  console.log("Metadata: ", metaData);

  const mintTx = await contract
    .connect((await ethers.getSigners())[0])
    .freeMint(to, metaData?.url);
  const tx: ContractTransactionReceipt | null = await mintTx.wait();
  console.log("Minted NFT Hash", tx?.hash);
}

// async function main() {
//   await Config.initConfig();

//   const NFTLearn = await ethers.getContractFactory("NFTLearn");
//   const NFTLearnAddress = (await Config.readValue("NFTLearn.address")) || "";
//   const contract = NFTLearn.attach(NFTLearnAddress) as NFTLearn;

//   console.log("NFTLearn was deployed to: ", await contract.getAddress());
//   console.log("Symbol: ", await contract.symbol());
//   console.log("Name: ", await contract.name());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
