import { getFile } from "blockstack";
import { CONSTANTS } from "@/storage/constants";

const auctionSearchService = {
  getUsersOnlineAuction: function(username) {
    return new Promise((resolve, reject) => {
      const auctionsRootFileName = CONSTANTS.auctionsRootFileName;
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
