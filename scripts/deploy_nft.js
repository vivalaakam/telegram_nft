const hre = require("hardhat");

async function main() {
    const signers = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", signers[0].address);

    const instance = await hre.ethers.deployContract("TelegramBot", [signers[0].address]);
    await instance.waitForDeployment();
    console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
