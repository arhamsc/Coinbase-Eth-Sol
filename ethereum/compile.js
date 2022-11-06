const path = require("path");
const solc = require("solc");
const fs = require("fs-extra"); //this is the new package we downloaded

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); //looks at the folder and deletes everything.

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
    language: "Solidity",
    sources: {
        "Campaign.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    "Campaign.sol"
];

fs.ensureDirSync(buildPath); //creates the build folder

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract + ".json"),
        output[contract],
    );
}
