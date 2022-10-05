const { ethers } = require("hardhat");
const { expect } = require("chai");


//the only way to prevent this attack is to never ever store the private data on-chain
describe('Login Attack', () => { 
    it("Should be able to read private data", async () => {

        //deploy the login contract
        const loginFactory = await ethers.getContractFactory("Login");

        //convert string to bytes32 array to save space
        const usernameBytes = ethers.utils.formatBytes32String("test");
        const passwordBytes = ethers.utils.formatBytes32String("password");

        const loginContract = await loginFactory.deploy(
            usernameBytes,
            passwordBytes
        );
        await loginContract.deployed();

        const slot0Bytes = await ethers.provider.getStorageAt(
            loginContract.address,0
        )
        const slot1Bytes = await ethers.provider.getStorageAt(
            loginContract.address, 1
        )

        expect(ethers.utils.parseBytes32String(slot0Bytes)).to.equal("test");
        expect(ethers.utils.parseBytes32String(slot1Bytes)).to.equal("password");
    })
 })