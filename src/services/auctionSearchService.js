import { getFile } from "blockstack";
import settings from "./settings";

const auctionSearchService = {
  getUsersOnlineAuction: function(username) {
    return new Promise((resolve, reject) => {
      const auctionsRootFileName = settings.auctionsRootFileName;
      getFile(auctionsRootFileName, { decrypt: false, username: username })
        .then(function(file) {
          if (file) {
            let rootFile = JSON.parse(file);
            resolve(rootFile.records);
          }
        })
        .catch(function() {
          resolve({});
          // reject(new Error({ error: "AUCTIONS_1", message: "Error get users online auction: username=" + username }));
        });
    });
  }
};
export default auctionSearchService;
