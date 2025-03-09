import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";
import Buttons from "@/components/Buttons"; // 🔹 Užtikrintas teisingas importas
import "@/styles/donation.module.css";

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

  // ✅ Tikriname, ar suma tinkama
  const isValidAmount = (value) => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) && parsedValue >= 0.0001 && parsedValue <= 100;
  };

  const handleDonation = async () => {
    if (!isValidAmount(amount)) {
      alert("⚠ Please enter a valid amount (0.0001 - 100 BNB).");
      return;
    }

    try {
      setLoading(true);

      if (typeof window === "undefined" || !window.ethereum) {
        alert("⚠ MetaMask is required to make a donation.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 🔹 Konvertuojame sumą į WEI
      const value = ethers.parseEther(amount);
      const fee = (value * 3n) / 100n; // 3% mokestis
      const donationAmount = value - fee; // Likusi suma po mokesčių

      // 🔹 Pervedimas į labdaros gavėjo adresą
      const tx1 = await signer.sendTransaction({
        to: selectedCharity.wallet,
        value: donationAmount,
      });
      await tx1.wait();

      // 🔹 Pervedimas į admin piniginę (3% fee)
      const tx2 = await signer.sendTransaction({
        to: adminWallet,
        value: fee,
      });
      await tx2.wait();

      alert(`✅ Donation successful! View transaction: https://bscscan.com/tx/${tx1.hash}`);
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Donation failed", error);
      alert("❌ Transaction failed. Please check your balance and network fees.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.donationContainer}>
      <h1>Donate Cryptocurrency to Trusted Funds</h1>

      {/* 📌 Labdaros organizacijos informacija */}
      <div className={styles.charityDisplay}>
        <img src={selectedCharity.image} alt={selectedCharity.name} />
        <h2>{selectedCharity.name}</h2>
        <p>{selectedCharity.description}</p>
        <a href={selectedCharity.link} target="_blank" rel="noopener noreferrer">
          🌍 Learn More
        </a>
      </div>

      {/* 📌 Įveskite sumą */}
      <div className={styles.inputGroup}>
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

      {/* 📌 Donate mygtukas */}
      <button className={styles.donateBtn} onClick={handleDonation} disabled={loading}>
        {loading ? "⏳ Processing..." : `Donate to ${selectedCharity.name}`}
      </button>

      {/* 📌 Navigacija tarp labdaros organizacijų */}
      <div className={styles.charityNavigation}>
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

      {/* 📌 Greiti navigacijos mygtukai */}
      <div className={styles.dashboardButtons}>
        <Buttons text="Send" onClick={() => router.push("/send")} />
        <Buttons text="Receive" onClick={() => router.push("/receive")} />
        <Buttons text="Stake" onClick={() => router.push("/stake")} />
        <Buttons text="Swap" onClick={() => router.push("/swap")} />
        <Buttons text="Donate" onClick={() => router.push("/donate")} />
      </div>
    </div>
  );
}
