import { MerkleTree } from "merkletreejs";
import { keccak256 } from "js-sha3";
import { ethers } from "hardhat";
import dotenv from "dotenv"
// inputs: array of users' addresses and quantity
// each item in the inputs array is a block of data

const inputs = [
  {
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    quantity: 1,
  },
  {
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    quantity: 2,
  },
  {
    address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    quantity: 1,
  },
];
// create leaves from users' address and quantity
const leaves = inputs.map((x) =>
  ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [x.address, x.quantity]
  )
);
// create a Merkle tree
const tree = new MerkleTree(leaves, keccak256, { sort: true });
console.log(tree.toString());

const proofs = leaves.map(leave=> tree.getHexProof(leaf))
const root = tree.getHexRoot();
console.log(root);
const proofs = leaves.map(leave=> tree.getHexProof(leaf))