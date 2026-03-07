const BUILDING_IMAGES: Record<number, string> = {
  1: "Treasury.png",
  2: "Venture Capital Fund.png",
  3: "Incubator.png",
  4: "Trading Desk.png",
  5: "Liquidity Pool.png",
  6: "Wallet Onboarding.png",
  7: "Crypto ATM.png",
  8: "Conference.png",
  9: "Hackathon.png",
  10: "Cairo Compiler.png",
  11: "Blockchain University.png",
  12: "ZK Prover.png",
  13: "NFT Marketplace.png",
  14: "Game Studio.png",
  15: "DeFi Protocol.png",
  16: "Social Network.png",
  17: "Sequencer Node.png",
  18: "Starknet Foundation.png",
  19: "Security Audit.png",
  20: "Arcade Machine.png",
  21: "Starknet Bridge.png",
  22: "Dapp Marketplace.png",
  23: "Wallet Onboarding.png",
  24: "Payment Processor.png",
  25: "Starknet Foundation.png",
};

export function getBuildingImage(buildingId: number): string {
  const filename = BUILDING_IMAGES[buildingId];
  if (!filename) return "";
  return `/buildings/${filename}`;
}

export function preloadBuildingImages(): void {
  const seen = new Set<string>();
  for (const filename of Object.values(BUILDING_IMAGES)) {
    if (seen.has(filename)) continue;
    seen.add(filename);
    const img = new Image();
    img.src = `/buildings/${filename}`;
  }
}
