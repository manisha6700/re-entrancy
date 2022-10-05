const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Attack", function (){
    it("Should empty the balance of the good contract", async function (){
        //deploy GC
        const goodContractFactory = await ethers.getContractFactory("GoodContract");
        const goodContract = await goodContractFactory.deploy();
        await goodContract.deployed();

        //deploy BC
        const badContractFactory = await ethers.getContractFactory("BadContract");
        const badContract = await badContractFactory.deploy(goodContract.address);
        await badContract.deployed();

        //create 2 users
        const [_, innocentAddress, attackerAddress] = await ethers.getSigners();

        //good user transfer funds
        let tx = await goodContract.connect(innocentAddress).addBalance({
            value:parseEther("10"),
        })
        await tx.wait();

        //check balance of GC
        let balanceETH = await ethers.provider.getBalance(goodContract.address);
        expect(balanceETH).to.equal(parseEther("10"));

        //bad user transfer funds
        tx = await badContract.connect(attackerAddress).attack({
            value:parseEther("1"),
        })
        await tx.wait();

        //check balance of GC
        balanceETH = await ethers.provider.getBalance(goodContract.address);
        expect(balanceETH).to.equal(BigNumber.from("0"));

        //check balance of attacker
        balanceETH = await ethers.provider.getBalance(badContract.address);
        expect(balanceETH).to.equal(parseEther("11"));
    })
})