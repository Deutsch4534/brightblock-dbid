import myAccountService from "@/services/myAccountService";
import store from "@/storage/store";

const myAccountStore = {
  namespaced: true,
  state: {
    myProfile: {
      username: null,
      loggedIn: false,
      showAdmin: false
    }
  },
  getters: {
    getMyProfile: state => {
      return state.myProfile;
    },
    getPaymentNetwork: state => {
      let profile = state.myProfile;
      if (!profile.loggedIn) {
        return;
      }
      let network = profile.publicKeyData.paymentNetwork;
      let address;
      if (network === 'bitcoin') {
        address = profile.publicKeyData.rxAddressList[0].address;
      } else if (network === 'lightning') {
        address = profile.publicKeyData.rxAddressList[1].address;
      } else if (network === 'stacks') {
        address = profile.publicKeyData.rxAddressList[2].address;
      }
      if (address && address.length > 15) {
        return network;
      }
      return null;
    },
    getProfileValidity: state => {
      let profile = state.myProfile;
      let emailValid = false;
      let au = profile.auxiliaryProfile;
      if (au && au.emailAddress && au.emailAddress.email && au.emailAddress.verified) {
        emailValid = true;
      }

      let address = profile.auxiliaryProfile.shippingAddress;
      let shippingValid = true;
      shippingValid = shippingValid && address && address.line1 && address.line1.length > 0;
      shippingValid = shippingValid && address.city && address.city.length > 0;
      shippingValid = shippingValid && address.region && address.region.length > 0;
      shippingValid = shippingValid && address.postcode && address.postcode.length > 0;

      let rxAddressList = profile.publicKeyData.rxAddressList;
      let bitcoinValid = false;
      if (rxAddressList[0] && rxAddressList[0].type === "bitcoin" && rxAddressList[0].address && rxAddressList[0].address.length > 10) {
        bitcoinValid = true;
      }

      return {
        emailValid: emailValid,
        shippingValid: shippingValid,
        bitcoinValid: bitcoinValid
      };
    }
  },
  mutations: {
    myProfile(state, myProfile) {
      state.myProfile = myProfile;
    }
  },
  actions: {
    fetchMyAccount({ state, commit }) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        if (!myProfile.loggedIn) {
          let loggedInState = myAccountService.isLoggedIn();
          if (loggedInState > 0) {
            if (loggedInState === 2) {
              myAccountService.doPendingSignin(function(res) {
                myProfile = myAccountService.myProfile();
                if (res) {
                  store.dispatch("myAccountStore/fetchFullProfile", myProfile).then(myProfile => {
                    commit("myProfile", myProfile);
                    resolve(myProfile);
                  })
                    .catch(e => {
                      resolve(myProfile);
                    });
                } else {
                  commit("myProfile", myProfile);
                  resolve(myProfile);
                }
              });
            } else {
              myProfile = myAccountService.myProfile();
              store.dispatch("myAccountStore/fetchFullProfile", myProfile).then(myProfile => {
                commit("myProfile", myProfile);
                resolve(myProfile);
              });
            }
          } else {
            myProfile = myAccountService.myProfile();
            commit("myProfile", myProfile);
            resolve(myProfile);
          }
        } else {
          //myProfile = myAccountService.myProfile();
          let validity = store.getters["myAccountStore/getProfileValidity"];
          if (validity.emailValid || validity.shippingValid || validity.bitcoinValid) {
            resolve(myProfile);
          } else {
            store.dispatch("myAccountStore/fetchFullProfile", myProfile).then(myProfile => {
              commit("myProfile", myProfile);
              resolve(myProfile);
            });
          }
        }
      });
    },
    fetchFullProfile({ state, commit }, myProfile) {
      return new Promise(resolve => {
        myAccountService.getAuxiliaryProfile(function(auxiliaryProfile) {
          myProfile.auxiliaryProfile = auxiliaryProfile;
          myAccountService.getPublicKeyData(function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            resolve(myProfile);
          }, function(err) {
            console.log(err);
            resolve(myProfile);
          });
        }, function(err) {
          console.log(err);
          resolve(myProfile);
        });
      });
    },
    updateAuxiliaryProfile({ state, commit }, auxiliaryProfile) {
      return new Promise(resolve => {
        myAccountService.updateAuxiliaryProfile(
          auxiliaryProfile,
          function(auxiliaryProfile) {
            let myProfile = state.myProfile;
            myProfile.auxiliaryProfile = auxiliaryProfile;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updatePublicKeyData({ state, commit }, publicKeyData) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myAccountService.updatePublicKeyData(myProfile, publicKeyData,
          function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updatePaymentNetwork({ state, commit }, network) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        if (!network || (network !== 'bitcoin' && network !== 'lightning' && network !== 'stacks')) {
          throw new Error("invalid network: " + network);
        }
        myProfile.publicKeyData.paymentNetwork = network;
        myAccountService.updatePublicKeyData(myProfile, myProfile.publicKeyData,
          function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updateBitcoinAddress({ state, commit }, bitcoinAddress) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        if (myProfile.publicKeyData && myProfile.publicKeyData.rxAddressList) {
          myProfile.publicKeyData.rxAddressList[0].address = bitcoinAddress;
        }
        myAccountService.updatePublicKeyData(myProfile, myProfile.publicKeyData,
          function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updateLightningAddress({ state, commit }, lightningAddress) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myProfile.publicKeyData.rxAddressList[1].address = lightningAddress;
        myAccountService.updatePublicKeyData(myProfile, myProfile.publicKeyData,
          function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    updateStacksAddress({ state, commit }, stacksAddress) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myProfile.publicKeyData.rxAddressList[2].address = stacksAddress;
        myAccountService.updatePublicKeyData(myProfile, myProfile.publicKeyData,
          function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
            resolve(myProfile);
          },
          function(error) {
            console.log("Error updating profile: ", error);
            resolve(error);
          }
        );
      });
    },
    addRelationship({ state, commit }, username) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        store.dispatch("userProfilesStore/fetchUserProfile", { username: username }, { root: true }).then(friendProfile => {
          myAccountService.addRelationship(myProfile, friendProfile, username,
            function(publicKeyData) {
              state.myProfile.publicKeyData = publicKeyData;
              commit("myProfile", myProfile);
              resolve(myProfile);
            },
            function(error) {
              console.log("Error updating profile: ", error);
              resolve(error);
            }
          );
        });
      });
    }
  }
};
export default myAccountStore;
