import axios from "axios";
import {
  Person,
  loadUserData,
  handlePendingSignIn,
  isSignInPending,
  isUserSignedIn,
  hexStringToECPair,
  redirectToSignIn,
  decodeToken,
  encryptContent,
  decryptContent,
  signUserOut, getFile, putFile, getPublicKeyFromPrivate
} from "blockstack";
import moment from "moment";
import userProfilesService from "./userProfilesService";
import _ from "lodash";

const auxiliaryProfileRootFileName = "profiles_v03.json";
const publicKeyDataRootFileName = "public_key_data_v03.json";
var checkPublicKeyData = function(publicKeyData) {
  if (!publicKeyData) {
    publicKeyData = {};
  }
  if (!publicKeyData.secured) {
    publicKeyData.secured = [];
  }
  if (!publicKeyData.trustedUsers) {
    publicKeyData.trustedUsers = [];
  }
  let account = loadUserData();
  if (account && !publicKeyData.publicBlockstackKey) {
    var authResponseToken = account.authResponseToken;
    var decodedToken = decodeToken(authResponseToken);
    var publicKey = decodedToken.payload.public_keys[0];
    publicKey = getPublicKeyFromPrivate(account.appPrivateKey);
    publicKeyData.publicBlockstackKey = publicKey;
  }

  if (!publicKeyData.paymentNetwork) {
    publicKeyData.paymentNetwork = "bitcoin";
  }

  if (!publicKeyData.rxAddressList) {
    publicKeyData.rxAddressList = [
      {
        type: "bitcoin",
        address: null
      },
      {
        type: "lightning",
        address: null,
        invoiceDate: moment({}).valueOf(),
        invoice: {}
      },
      {
        type: "stack",
        address: null
      }
    ];
  }
  return publicKeyData;
};
var checkAuxiliaryProfile = function(auxiliaryProfile) {
  if (!auxiliaryProfile) {
    auxiliaryProfile = {};
  }
  if (!auxiliaryProfile.created) {
    auxiliaryProfile.created = moment({}).valueOf();
  }
  if (!auxiliaryProfile.shippingAddress) {
    auxiliaryProfile.shippingAddress = {};
  }
  if (!auxiliaryProfile.emailAddress) {
    auxiliaryProfile.emailAddress = {};
  }
  if (!auxiliaryProfile.trustedIds) {
    auxiliaryProfile.trustedIds = "";
  }
  return auxiliaryProfile;
};
const myAccountService = {
  myBlockstackId: function() {
    return loadUserData().username;
  },
  myProfile: function() {
    let myProfile;
    let account = loadUserData();
    if (account) {
      let uname = account.username;
      let person = new Person(account.profile);
      let name = person.name();
      if (uname) {
        if (!name) {
          let indexOfDot = uname.indexOf(".");
          name = uname.substring(0, indexOfDot);
        }
      }
      if (!uname && name) {
        uname = name;
      }
      if (!uname) {
        uname = "";
      }
      let showAdmin =
        uname === "mike.personal.id" ||
        uname.indexOf("brightblock") > -1 ||
        uname.indexOf("head") > -1 ||
        uname.indexOf("feek") > -1;
      let avatarUrl = person.avatarUrl();
      if (!avatarUrl) {
        //avatarUrl =  "@/assets/img/missing/avater-small-missing.jpg";
      }
      let privateKey = account.appPrivateKey + "01";
      privateKey = hexStringToECPair(privateKey).toWIF();
      var authResponseToken = account.authResponseToken;
      var decodedToken = decodeToken(authResponseToken);
      var publicKey = decodedToken.payload.public_keys[0];
      publicKey = getPublicKeyFromPrivate(account.appPrivateKey);

      myProfile = {
        loggedIn: true,
        identityAddress: account.identityAddress,
        publicKey: publicKey,
        appPrivateKey: privateKey,
        showAdmin: showAdmin,
        name: name,
        description: person.description(),
        avatarUrl: avatarUrl,
        username: uname,
        hubUrl: account.hubUrl,
        apps: account.profile.apps,
      };
    } else {
      myProfile = {
        loggedIn: false,
        auxiliaryProfile: checkAuxiliaryProfile(),
        publicKeyData: checkPublicKeyData()
      };
    }
    return myProfile;
  },
  isPending: function() {
    return isSignInPending();
  },
  canLogIn: function() {
    return new Promise(resolve => {
      axios
        .get("http://localhost:6270/v1/ping")
        .then(response => {
          resolve(response.data.status === "alive");
        })
        .catch(e => {
          console.log("No one listening on 6270?", e);
          resolve(true);
        });
    });
  },
  isLoggedIn: function() {
    if (isUserSignedIn()) {
      return 1;
    } else if (isSignInPending()) {
      handlePendingSignIn().then(() => {
        console.log("Pending signin...");
      });
      return 2;
    } else {
      return -1;
    }
  },
  doPendingSignin: function(success) {
    handlePendingSignIn().then(() => {
      success(true);
    })
      .catch(e => {
        success(false);
      });
  },
  logout: function() {
    signUserOut(window.location.origin);
  },
  loginMultiPlayer: function() {
    if (this.isLoggedIn() < 0) {
      const origin = window.location.origin;
      redirectToSignIn(origin, origin + "/manifest.json", [
        "store_write",
        "publish_data"
      ]);
    }
  },
  login: function() {
    if (!this.isLoggedIn()) {
      redirectToSignIn();
    }
  },
  updateAuxiliaryProfile: function(auxiliaryProfile, success, failure) {
    putFile(auxiliaryProfileRootFileName, JSON.stringify(checkAuxiliaryProfile(auxiliaryProfile)), {encrypt: true})
      .then(function() {
        success(auxiliaryProfile);
      })
      .catch(function() {
        failure({ERR_CODE: 4, message: "Error uploading aux profile."});
      });
  },
  encryptMessage: function(message, pubkey) {
    return encryptContent(JSON.stringify(message), {publicKey: pubkey});
  },
  decryptMessage: function(message) {
    return JSON.parse(decryptContent(message));
  },
  updatePublicKeyData: function(myProfile, publicKeyData, success, failure) {
    // check for trusted ids for whom we want to encrypt our private data with their public key.
    let auxiliaryProfile = myProfile.auxiliaryProfile;
    publicKeyData.publicBlockstackKey = myProfile.publicKey;
    if (!publicKeyData.secured) {
      publicKeyData.secured = [];
    }
    if (auxiliaryProfile.trustedIds) {
      let trustedIds = auxiliaryProfile.trustedIds.split(",");
      _.forEach(trustedIds, function(trustedId) {
        // fetch the users publicKeyData file - we need their pub key to encrypt our address!!!
        let username = trustedId.trim();
        userProfilesService.fetchUserProfile(username, function (userProfile) {
          if (userProfile.publicKeyData && userProfile.publicKeyData.publicBlockstackKey) {
            let pubkey = userProfile.publicKeyData.publicBlockstackKey;
            let encObj = {
              username: username
            };
            if (auxiliaryProfile.emailAddress) {
              encObj.emailAddress = encryptContent(JSON.stringify(auxiliaryProfile.emailAddress), {publicKey: pubkey});
            }
            if (auxiliaryProfile.shippingAddress) {
              encObj.shippingAddress = encryptContent(JSON.stringify(auxiliaryProfile.shippingAddress), {publicKey: pubkey});
            }
            publicKeyData.secured.push(encObj);
          }
          putFile(publicKeyDataRootFileName, JSON.stringify(checkPublicKeyData(publicKeyData)), {encrypt: false}).then(() => {
            success(publicKeyData);
          });
        });
      });
    } else {
      putFile(publicKeyDataRootFileName, JSON.stringify(checkPublicKeyData(publicKeyData)), {encrypt: false}).then(() => {
        success(publicKeyData);
      });
    }
  },
  addRelationship: function(myProfile, friendProfile, username, success, failure) {
    // check for trusted ids for whom we want to encrypt our private data with their public key.
    if (!friendProfile.publicKeyData || !friendProfile.publicKeyData.publicBlockstackKey) {
      if (failure) failure();
    }
    let auxiliaryProfile = myProfile.auxiliaryProfile;
    let publicKeyData = myProfile.publicKeyData;
    let sellerPubkey = friendProfile.publicKeyData.publicBlockstackKey;
    if (!publicKeyData.secured) publicKeyData.secured = [];
    let encObj = {
      username: friendProfile.username
    };
    if (auxiliaryProfile.emailAddress) {
      encObj.emailAddress = encryptContent(JSON.stringify(auxiliaryProfile.emailAddress), {publicKey: sellerPubkey});
    }
    if (auxiliaryProfile.shippingAddress) {
      encObj.shippingAddress = encryptContent(JSON.stringify(auxiliaryProfile.shippingAddress), {publicKey: sellerPubkey});
    }
    let index = _.findIndex(publicKeyData.secured, function(o) {
      return o.username === username;
    });
    if (index === -1) {
      publicKeyData.secured.push(encObj);
    } else {
      publicKeyData.secured.splice(index, 1, encObj);
    }
    putFile(publicKeyDataRootFileName, JSON.stringify(checkPublicKeyData(publicKeyData)), {encrypt: false}).then(() => {
      success(publicKeyData);
    });
  },
  getAuxiliaryProfile: function(success, failure) {
    let auxiliaryProfile = checkAuxiliaryProfile();
    getFile(auxiliaryProfileRootFileName, { decrypt: true }).then(function(file) {
      if (file) {
        auxiliaryProfile = checkAuxiliaryProfile(JSON.parse(file));
        success(auxiliaryProfile);
      } else {
        putFile(auxiliaryProfileRootFileName, JSON.stringify(auxiliaryProfile), {encrypt: true}).then(function(file) {
          success(auxiliaryProfile);
        });
      }
    })
      .catch(function(err) {
        putFile(auxiliaryProfileRootFileName, JSON.stringify(auxiliaryProfile), {encrypt: true}).then(function(file) {
          success(auxiliaryProfile);
        });
        console.log(err);
        // failure({ ERR_CODE: 5, message: "no auxiliaryProfile found: " + err });
      });
  },
  getPublicKeyData: function(success, failure) {
    let publicKeyData = checkPublicKeyData();
    getFile(publicKeyDataRootFileName, { decrypt: false }).then(function(file) {
      if (!file) {
        putFile(publicKeyDataRootFileName, JSON.stringify(publicKeyData), {encrypt: false}).then(function(file) {
          success(publicKeyData);
        });
      } else {
        let publicKeyData = checkPublicKeyData(JSON.parse(file));
        success(publicKeyData);
      }
    });
  }
};
export default myAccountService;
