const BUILDING_IMAGES: Record<number, string> = {
  1: "Treasury.png",
  2: "Angel Syndicate.png",
  3: "Venture Fund.png",
  4: "Trading Floor.png",
  5: "Capital Markets.png",
  6: "Account Portal.png",
  7: "Growth Hub.png",
  8: "Community Hub.png",
  9: "Developer Relations.png",
  10: "R&D Lab.png",
  11: "Cairo Lab.png",
  12: "ZK Research.png",
  13: "NFT Marketplace.png",
  14: "Game Studio.png",
  15: "Decentralized Exchange.png",
  16: "Social Platform.png",
  17: "Appchain Network.png",
  18: "Starknet Foundation.png",
  19: "Protocol Institute.png",
  20: "Sequencer.png",
  21: "Starknet Bridge.png",
  22: "RPC Provider.png",
  23: "Wallet Provider.png",
  24: "Arcade Machine.png",
  25: "Identity Protocol.png",
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
