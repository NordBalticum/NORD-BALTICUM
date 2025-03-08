import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const charities = [
  {
    name: "Binance Charity",
    description: "A blockchain-powered donation platform for global good.",
    wallet: "0xC4bE47E7Ed6D61F6E3959C2332178dA8C7a2d99A",
    image: "/images/binance-charity.png",
    link: "https://www.binance.charity/",
  },
  {
    name: "Human Needs Project",
    description: "Empowering communities with infrastructure and services.",
    wallet: "0x8D8b091D0f113BF1B4e1F53c2ea810565BFD8C18",
    image: "/images/human-needs.png",
    link: "https://www.humanneedsproject.org/donate",
  },
  {
    name: "Bit2Me Flood Relief",
    description: "Crypto-powered disaster relief for flood victims.",
    wallet: "0x03D310e8E3b70d2B958AE17447bD3f00eDDAC517",
    image: "/images/bit2me-flood.png",
    link: "https://blog.bit2me.com/en/bit2me-enables-crypto-addresses-for-donations-in-support-of-flood-victims/",
  },
];

export default function Donation() {
  const [selectedCharity, setSelectedCharity] = useState(charities[0]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET;

  // Tikriname ar suma tinkama
  const isValidAmount = (value) => {
    return !isNaN(value) && parseFloat(value) > 0.0001 && parseFloat(value) <= 100; // Min 0.0001 BNB, Max 100 BNB
  };

  const handleDonation = async () => {
    if (!isValidAmount(amount)) {
      alert("Please enter a valid amount (0.0001 - 100 BNB).");
      return;
    }

    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("MetaMask is required to make a donation.");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Konvertuojame sumą į WEI
      const value = ethers.utils.parseEther(amount);

      // Skaičiuojame mokesčius (3% admin fee)
      const fee = value.mul(3).div(100);
      const totalAmount = value; // Bendra transakcijos suma

      // Gavėjų sąrašas
      const recipients = [
        {
          to: selectedCharity.wallet,
          value: value.sub(fee),
        },
        {
          to: adminWallet,
          value: fee,
        },
      ];

      // Siunčiame transakciją
      const tx = await signer.sendTransaction({
        to: recipients[0].to,
        value: recipients[0].value.add(recipients[1].value), // Viena transakcija apima abi sumas
      });

      await tx.wait();

      alert(`Donation successful! View transaction: https://bscscan.com/tx/${tx.hash}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("Donation failed", error);
      alert("Transaction failed. Please check your balance and network fees.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-container">
      <h1>Donate Cryptocurrency to Trusted Funds</h1>
      <div className="charity-display">
        <img src={selectedCharity.image} alt={selectedCharity.name} />
        <h2>{selectedCharity.name}</h2>
        <p>{selectedCharity.description}</p>
        <a href={selectedCharity.link} target="_blank" rel="noopener noreferrer">
          Learn More
        </a>
      </div>

      <div className="input-group">
        <label>Amount (BNB)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter donation amount in BNB"
          min="0.0001"
          max="100"
          step="0.0001"
        />
      </div>

      <button className="donate-btn" onClick={handleDonation} disabled={loading}>
        {loading ? "Processing..." : `Donate to ${selectedCharity.name}`}
      </button>

      <div className="charity-navigation">
        <button
          onClick={() =>
            setSelectedCharity(
              charities[
                (charities.indexOf(selectedCharity) - 1 + charities.length) %
                  charities.length
              ]
            )
          }
        >
          ← Previous
        </button>
        <button
          onClick={() =>
            setSelectedCharity(
              charities[(charities.indexOf(selectedCharity) + 1) % charities.length]
            )
          }
        >
          Next →
        </button>
      </div>
    </div>
  );
}
