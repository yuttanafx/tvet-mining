const { ethers } = require("ethers");

module.exports = async (req, res) => {
    // 1. ตรวจสอบว่าเป็นคำสั่ง POST เท่านั้น
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // 2. ดึงข้อมูลกระเป๋าและจำนวนเหรียญจากหน้าเว็บ
        const { userAddress, amount } = req.body;
        
        // 3. ดึง Private Key ที่คุณตั้งไว้ใน Vercel
        const privateKey = process.env.SIGNER_PRIVATE_KEY;
        if (!privateKey) {
            return res.status(500).json({ error: "Signer key not configured" });
        }
        
        const signer = new ethers.Wallet(privateKey);

        // 4. สร้างข้อความเพื่อเซ็นลายเซ็น (Hash ตามที่ Smart Contract ต้องการ)
        // ต้องตรงกับ logic ใน Smart Contract ของคุณ
        const messageHash = ethers.solidityPackedKeccak256(
            ["address", "uint256"],
            [userAddress, amount]
        );

        // 5. ทำการเซ็น (Sign) ด้วย Private Key
        const signature = await signer.signMessage(ethers.getBytes(messageHash));

        // 6. ส่งลายเซ็นกลับไปที่หน้าเว็บ
        res.status(200).json({ signature, totalCumulativeAmount: amount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
