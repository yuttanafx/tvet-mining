import { ethers } from "ethers";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { userAddress, amount } = req.body;
    const privateKey = process.env.SIGNER_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey);

    // 1. เรียงลำดับตัวแปรให้ตรงกับ Solidity: (userAddress, amount)
    const messageHash = ethers.solidityPackedKeccak256(["address", "uint256"], [userAddress, amount]);
    
    // 2. แปลงเป็น bytes เพื่อเซ็นลายเซ็น
    const messageHashBytes = ethers.getBytes(messageHash);
    
    // 3. ใช้ signMessage ซึ่งจะเติม Prefix \x19Ethereum Signed Message:\n32 ให้เองตามมาตรฐาน Solidity
    const signature = await wallet.signMessage(messageHashBytes);

    res.status(200).json({ signature });
}
