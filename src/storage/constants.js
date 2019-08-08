const dev = location.origin.indexOf("localhost") > -1;

export const CONSTANTS = {
  apiKey: "46171452",
  nodeEnv: (dev) ? "development" : "production",
  environment: (dev) ? "development" : "production",
  // shapeShiftUrl: "https://shapeshift.io",
  // ethGatewayUrl: gatewayUrl,
  // btcGatewayUrl: gatewayUrl,
  // gaiaHubUrl: gaiaHubUrl,
  // searchUrl: searchUrl,
  // commsUrl: commsUrl,
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
