const dev = location.origin.indexOf("localhost") > -1;
const staging = (location.origin.indexOf("staging") > -1 || location.origin.indexOf("tdbid") > -1 || location.origin.indexOf("tart") > -1 || location.origin.indexOf("8081") > -1);
const switched = false;
var btcGatewayUrl = "http://localhost:8191";
var ethGatewayUrl = "http://localhost:8191";
var staxGatewayUrl = "http://localhost:8191";
var gaiaHubUrl = "http://localhost:8195";
var searchUrl = "http://localhost:8193";
var commsUrl = "http://localhost:8197";
var lndGatewayUrlAlice = "localhost:10011";
var lndGatewayUrlBob = "localhost:10012";
if (!dev) {
  if (switched) {
    if (staging) {
      btcGatewayUrl = "https://tapi.radiclesociety.org";
      ethGatewayUrl = "https://tapi.radiclesociety.org";
      staxGatewayUrl = "https://tapi.radiclesociety.org";
      searchUrl = "https://tindex.radiclesociety.org";
      gaiaHubUrl = "https://tgaia.radiclesociety.org";
      commsUrl = "https://tcomms.radiclesociety.org";
      lndGatewayUrlAlice = "tlnda.radiclesociety.org:10011";
      lndGatewayUrlBob = "tlndb.radiclesociety.org:10012";
    } else {
      btcGatewayUrl = "https://api.radiclesociety.org";
      ethGatewayUrl = "https://api.radiclesociety.org";
      staxGatewayUrl = "https://api.radiclesociety.org";
      searchUrl = "https://index.radiclesociety.org";
      gaiaHubUrl = "https://gaia.radiclesociety.org";
      commsUrl = "https://comms.radiclesociety.org";
      lndGatewayUrlAlice = "lnda.radiclesociety.org:10011";
      lndGatewayUrlBob = "lndb.radiclesociety.org:10012";
    }
  } else if (!switched) {
    if (staging) {
      btcGatewayUrl = "https://api-staging.brightblock.org";
      ethGatewayUrl = "https://api-staging.brightblock.org";
      staxGatewayUrl = "https://api-staging.brightblock.org";
      searchUrl = "https://search-staging.brightblock.org";
      gaiaHubUrl = "https://gaia.brightblock.org";
      commsUrl = "https://api-staging.brightblock.org";
      lndGatewayUrlAlice = "api-staging.brightblock.org:10011";
      lndGatewayUrlBob = "api-staging.brightblock.org:10012";
    } else {
      btcGatewayUrl = "https://api.brightblock.org";
      ethGatewayUrl = "https://api.brightblock.org";
      staxGatewayUrl = "https://api.brightblock.org";
      gaiaHubUrl = "https://gaia.brightblock.org";
      searchUrl = "https://search.brightblock.org";
      commsUrl = "https://api.brightblock.org";
      lndGatewayUrlAlice = "api.brightblock.org:10011";
      lndGatewayUrlBob = "api.brightblock.org:10012";
    }
  }
}

export const API_CONSTANTS = {
  btcGatewayUrl: btcGatewayUrl,
  ethGatewayUrl: ethGatewayUrl,
  staxGatewayUrl: staxGatewayUrl,
  gaiaHubUrl: gaiaHubUrl,
  searchUrl: searchUrl,
  commsUrl: commsUrl,
  lndGatewayUrlAlice: lndGatewayUrlAlice,
  lndGatewayUrlBob: lndGatewayUrlBob
};
