const dev = location.origin.indexOf("localhost") > -1;
export const CONSTANTS = {
  apiKey: "46171452",
  nodeEnv: (dev) ? "development" : "production",
  environment: (dev) ? "development" : "production",
  shapeShiftUrl: "https://shapeshift.io",
  ethGatewayUrl: (dev) ? "http://localhost:8191" : "https://api.brightblock.org",
  btcGatewayUrl: (dev) ? "http://localhost:8191" : "https://api.brightblock.org",
  gaiaHubUrl: (dev) ? "http://localhost:8195" : "https://gaia.brightblock.org",
  searchUrl: (dev) ? "http://localhost:8193" : "https://search.brightblock.org",
  commsUrl: (dev) ? "http://localhost:8197/comms" : "https://api.brightblock.org/comms",
  taxonomy: {
    keywords: ["contemporary", "modern", "outsider", "political", "bauhaus", "impressionism", "noir", "cartoon", "illustration", "grafitti"],
    media: [
      {label: "Digital", value: "digital"},
      {label: "Physical", value: "physical"},
    ],
    saleTypes: [
      {label: "Buy Now", value: "buyNow", soid: 1},
      {label: "Make Offer", value: "makeOffer", soid: 3},
      {label: "In Auction", value: "inAuction", soid: 2},
      {label: "Listing", value: "listing", soid: 0}
    ]
  },
  networkExpected: (dev) ? "Ganache" : "Ropsten (3)",
  featureEthereum: false,
  featureBitcoin: true,
  featureAuctions: true,
  debugMode: false,
  domain: location.origin,
  invoicesRootFileName: "invoices_v01.json",
  publicKeyDataRootFileName: "public_key_data_v01.json",
  artworkRootFileName: "records_v01.json",
  galleriesRootFileName: "galleries_v01.json",
  gIndexDataPrefix: "gallery_",
  gaiaFileName: "record_",
  statuses: {
    item: {
      NOT_REGISTERED: "NOT_REGISTERED",
      NOT_SELLING: "NOT_SELLING",
      PURCHASE_ENABLED: "PURCHASE_ENABLED",
      BIDDING_ENABLED: "BIDDING_ENABLED",
      PURCHASE_BEGUN: "PURCHASE_BEGUN",
      PURCHASE_COMPLETE: "PURCHASE_COMPLETE",
    },
    artwork: {
      NOT_REGISTERED: "NOT_REGISTERED",
      NOT_SELLING: "NOT_SELLING",
      PURCHASE_ENABLED: "PURCHASE_ENABLED",
      BIDDING_ENABLED: "BIDDING_ENABLED",
      PURCHASE_BEGUN: "PURCHASE_BEGUN",
      PURCHASE_COMPLETE: "PURCHASE_COMPLETE",
    }
  }
};
