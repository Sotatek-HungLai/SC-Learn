import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { TokenLearnVault, TokenLearn } from "../typechain-types";

describe("TokenLearn", function () {
  let tokenLearn: TokenLearn,
    tokenLearnVault: TokenLearnVault,
    owner: Signer,
    addr1: Signer;
  const mintingFee = ethers.parseUnits("0.01", "ether");

  beforeEach(async () => {
    tokenLearn = await ethers.deployContract("TokenLearn");
    tokenLearnVault = await ethers.deployContract("TokenLearnVault", [
      await tokenLearn.getAddress(),
    ]);
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should set the right owner", async function () {
    expect(await tokenLearn.owner()).to.equal(await owner.getAddress());
  });

  it("Should mint tokens free", async function () {
    await tokenLearn.connect(addr1).mintFree(addr1, 50);
    expect(await tokenLearn.balanceOf(await addr1.getAddress())).to.equal(50);
  });

  it("Should mint tokens with fee", async function () {
    const initBalanceOwner = await ethers.provider.getBalance(
      await owner.getAddress()
    );
    await tokenLearn
      .connect(addr1)
      .mintWithFee(await addr1.getAddress(), 50, { value: mintingFee });

    expect(await tokenLearn.balanceOf(await addr1.getAddress())).to.equal(50);
    expect(await ethers.provider.getBalance(await owner.getAddress())).to.equal(
      initBalanceOwner + mintingFee
    );
  });
});
