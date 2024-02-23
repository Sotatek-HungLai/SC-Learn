import { ethers } from "hardhat";
import { mintNFT, storeNFT } from "../scripts/mint";
import { expect } from "chai";
import { Signer } from "ethers";
import { NFTLearnVault, NFTLearn } from "../typechain-types";

describe("Nft NFTLearn", () => {
  let NFTLearn: NFTLearn,
    NFTLearnVault: NFTLearnVault,
    owner: Signer,
    addr1: Signer;
  const mintingFee = ethers.parseUnits("0.01", "ether");

  beforeEach(async () => {
    NFTLearn = await ethers.deployContract("NFTLearn");
    NFTLearnVault = await ethers.deployContract("NFTLearnVault", [
      await NFTLearn.getAddress(),
    ]);
    [owner, addr1] = await ethers.getSigners();
  });

  it("mint nft free", async () => {
    const metadata = await storeNFT({
      filePath: "5.png",
      name: "test",
      description: "test",
    });
    console.log("Metadata: ", metadata);

    await NFTLearn.connect(owner).freeMint(
      await NFTLearn.owner(),
      metadata?.url
    );

    const tokenId = (await NFTLearn.currentCounter()) - BigInt(1);

    expect(await NFTLearn.ownerOf(tokenId)).to.equal(await NFTLearn.owner());
  });

  it("should mint NFT with paid fee", async () => {
    console.log("NFTLearn was deployed to: ", await NFTLearn.getAddress());
    console.log("Name: ", await NFTLearn.name());
    console.log("Symbol: ", await NFTLearn.symbol());

    const metadata = await storeNFT({
      filePath: "5.png",
      name: "test",
      description: "test",
    });

    console.log("Owner: ", await owner.getAddress());
    console.log("Owner NFTLearn: ", await NFTLearn.owner());
    const initBalanceOwner = await ethers.provider.getBalance(
      await owner.getAddress()
    );
    console.log("initBalanceOwner: ", initBalanceOwner);

    await NFTLearn.connect(addr1).mintWithFee(
      await addr1.getAddress(),
      metadata?.url,
      {
        value: mintingFee,
      }
    );

    const balanceOwner = await ethers.provider.getBalance(
      await owner.getAddress()
    );
    console.log("balanceOwner: ", balanceOwner);

    expect(balanceOwner).equal(initBalanceOwner + mintingFee);
  });

  it("should fail to mint NFT if not enough balance to pay fee", async () => {
    console.log("NFTLearn was deployed to: ", await NFTLearn.getAddress());
    console.log("Name: ", await NFTLearn.name());
    console.log("Symbol: ", await NFTLearn.symbol());

    const metadata = await storeNFT({
      filePath: "5.png",
      name: "test",
      description: "test",
    });

    console.log("Owner: ", await owner.getAddress());
    console.log("Owner NFTLearn: ", await NFTLearn.owner());
    const initBalanceOwner = await ethers.provider.getBalance(
      await owner.getAddress()
    );
    console.log("initBalanceOwner: ", initBalanceOwner);

    await NFTLearn.connect(addr1).mintWithFee(
      await addr1.getAddress(),
      metadata?.url,
      {
        value: 0,
      }
    );

    const balanceOwner = await ethers.provider.getBalance(
      await owner.getAddress()
    );
    console.log("balanceOwner: ", balanceOwner);

    expect(balanceOwner).equal(initBalanceOwner);
  });

  it("deposit nft", async () => {
    const metadata = await storeNFT({
      filePath: "5.png",
      name: "test",
      description: "test",
    });
    console.log("Metadata: ", metadata);

    await NFTLearn.connect(owner).freeMint(
      await NFTLearn.owner(),
      metadata?.url
    );

    const tokenId = (await NFTLearn.currentCounter()) - BigInt(1);
    // expect(await NFTLearn.ownerOf(tokenId)).to.equal(owner.address);
    console.log(`Owner of ${tokenId}: `, await NFTLearn.ownerOf(tokenId));

    await NFTLearn.approve(await NFTLearnVault.getAddress(), tokenId);

    await NFTLearnVault.connect(owner).deposit(tokenId);
    expect(await NFTLearn.ownerOf(tokenId)).to.equal(
      await NFTLearnVault.getAddress()
    );
  });

  it.only("withdraw nft", async () => {
    const metadata = await storeNFT({
      filePath: "5.png",
      name: "test",
      description: "test",
    });
    console.log("Metadata: ", metadata);

    await NFTLearn.connect(owner).freeMint(
      await addr1.getAddress(),
      metadata?.url
    );

    const tokenId = (await NFTLearn.currentCounter()) - BigInt(1);
    console.log(`Owner of ${tokenId}: `, await NFTLearn.ownerOf(tokenId));

    await NFTLearn.connect(addr1).approve(
      await NFTLearnVault.getAddress(),
      tokenId
    );

    await NFTLearnVault.connect(addr1).deposit(tokenId);

    await NFTLearnVault.connect(addr1).withdraw(tokenId);

    expect(await NFTLearn.ownerOf(tokenId)).to.equal(await addr1.getAddress());
  });
});
