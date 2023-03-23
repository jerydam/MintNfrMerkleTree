import { ethers } from "hardhat";
import * as fs from "fs";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers/lib/utils";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.MAINNET_RPC
  );

  const inputs = [
    {
      address: "0x87d37b9B303b4b0F23cc7420b8431Fdd5FA17e62",
      quantity: 1,
    },
    {
      address: "0xF4387F4ffD3DF6fE3F582e23c53418966043eAB2",
      quantity: 1,
    },
    {
      address: "0x54d961fe5fadD14275F3E1e3b85cd95202b0c6E0",
      quantity: 1,
    },
     {
      address: "0x1990bBC7bF55Ca3836910Bb8064AF5AEA1aa3990",
      quantity: 1,
    },
     {
      address: "0x1e53A50A0B40C9E402B8438f1feFB47ac4036bd1",
      quantity: 1,
    },
  ];

  const leaves = inputs.map((value) =>
    ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [value.address, value.quantity]
    )
  );

  console.log(`your leaves are ${leaves}`);

  const tree = new MerkleTree(leaves, ethers.utils.keccak256);
  console.log(`your tree is ${tree}`);

  const root = tree.getHexRoot();
  console.log(`Your root is ${root}`);

  const proof = tree.getProof(leaves[0]);
  console.log(`Your proof is ${proof}`);

  const [owner] = await ethers.getSigners();
  const Mynft = await ethers.getContractFactory("MintNft");
  const mynft = await Mynft.deploy(root);
  await mynft.deployed();
  console.log(`Contract deployed to ${token.address}`);

  const treeData = {
    leaves: leaves.map((leaf) => leaf.toString()),
    root: root.toString(),
    depth: tree.getDepth(),
  };
  fs.writeFileSync("merkle-tree.json", JSON.stringify(treeData));
  fs.writeFileSync("merkle-proof.json", JSON.stringify(proof));

  const verify = tree.verify(proof, leaves[0], root);
  console.log(`verified ${verify}`);
  const prove = [
    224, 202, 49, 135, 67, 13, 87, 29, 170, 179, 98, 29, 139, 40, 6, 80, 110,
    246, 168, 79, 180, 195, 18, 220, 71, 34, 204, 132, 154, 1, 249, 184,
  ];
  mynft.mint(1, prove);

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
}