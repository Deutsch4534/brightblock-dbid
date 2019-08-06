const dev = location.origin.indexOf("localhost") > -1;
const staging = (location.origin.indexOf("staging") > -1 || location.origin.indexOf("tdbid") > -1 || location.origin.indexOf("tart") > -1 || location.origin.indexOf("8081") > -1);
const switched = false;
var gatewayUrl = "http://localhost:8191";
var gaiaHubUrl = "http://localhost:8195";
var searchUrl = "http://localhost:8193";
var commsUrl = "http://localhost:8197";
if (!dev) {
  if (switched) {
    if (staging) {
      gatewayUrl = "https://tapi.radiclesociety.org";
      searchUrl = "https://tindex.radiclesociety.org";
      gaiaHubUrl = "https://tgaia.radiclesociety.org";
      commsUrl = "https://tcomms.radiclesociety.org";
    } else {
      gatewayUrl = "https://api.radiclesociety.org";
      searchUrl = "https://index.radiclesociety.org";
      gaiaHubUrl = "https://gaia.radiclesociety.org";
      commsUrl = "https://comms.radiclesociety.org";
    }
  } else if (!switched) {
    if (staging) {
      gatewayUrl = "https://api-staging.brightblock.org";
      searchUrl = "https://search-staging.brightblock.org";
      gaiaHubUrl = "https://gaia.brightblock.org";
      commsUrl = "https://api-staging.brightblock.org";
    } else {
      gatewayUrl = "https://api.brightblock.org";
      gaiaHubUrl = "https://gaia.brightblock.org";
      searchUrl = "https://search.brightblock.org";
      commsUrl = "https://api.brightblock.org";
    }
  }
}

export const CONSTANTS = {
  apiKey: "46171452",
  nodeEnv: (dev) ? "development" : "production",
  environment: (dev) ? "development" : "production",
  shapeShiftUrl: "https://shapeshift.io",
  ethGatewayUrl: gatewayUrl,
  btcGatewayUrl: gatewayUrl,
  gaiaHubUrl: gaiaHubUrl,
  searchUrl: searchUrl,
  commsUrl: commsUrl,
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
