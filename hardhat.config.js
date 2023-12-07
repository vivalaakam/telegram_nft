require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.23",
    optimizer: {
        enabled: true,
        runs: 200
    },
    networks: {
        local: {
            url: "http://localhost:8545/"
        }
    }
};
