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
                commit("myProfile", myAccountService.myProfile());
                store.dispatch("myAccountStore/fetchMyAccount");
                resolve(myProfile);
              });
            } else {
              myProfile = myAccountService.myProfile();
              commit("myProfile", myProfile);
              resolve(myProfile);
            }
          } else {
            myProfile = {
              loggedIn: false
            };
            resolve(myProfile);
            return;
          }
        }
        myAccountService.getAuxiliaryProfile(function(auxiliaryProfile) {
          myProfile.auxiliaryProfile = auxiliaryProfile;
          commit("myProfile", myProfile);
          myAccountService.getPublicKeyData(myProfile, function(publicKeyData) {
            myProfile.publicKeyData = publicKeyData;
            commit("myProfile", myProfile);
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
    updateBitcoinAddress({ state, commit }, bitcoinAddress) {
      return new Promise(resolve => {
        let myProfile = state.myProfile;
        myProfile.publicKeyData.bitcoinAddress = bitcoinAddress;
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
