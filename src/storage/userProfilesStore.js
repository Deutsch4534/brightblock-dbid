// myAccountStore.js
import userProfilesService from "@/services/userProfilesService";
import _ from "lodash";
import store from "@/storage/store";
import {
  decryptContent
} from "blockstack";

const userProfilesStore = {
  namespaced: true,
  state: {
    userProfiles: [],
    teamProfiles: [],
    namesRequestList: []
  },
  getters: {
    getTeamProfile: state => profileId => {
      let matches = state.teamProfiles.filter(
        profile => profile.id === profileId
      );
      if (matches.length > 0) {
        return matches[0];
      }
      return {
        data: {
          name: [{ text: "Unknown" }],
          jobtitle: [{ text: "Unknown" }],
          jobdescription: [{ text: "Unknown" }],
          avatar: {
            url: require("@/assets/img/faces/avatar.jpg")
          }
        }
      };
    },
    getShippingAddress: state => (buyer, seller) => {
      if (buyer) {
        let buyerProfile = _.find(state.userProfiles, function(o) {
          return o.username === buyer;
        });
        if (buyerProfile) {
          let secured = _.find(buyerProfile.publicKeyData.secured, function(o) {
            return o.username === seller;
          });
          if (secured) {
            try {
              // json is parsed in decrypt method.
              let sa = decryptContent(secured.shippingAddress);
              return sa;
            } catch (err) {
              return {};
            }
          }
        }
      }
    },
    getProfile: state => (username, doDispatch) => {
      if (username) {
        let matches = state.userProfiles.filter(profile => profile.username === username);
        if (matches.length > 0) {
          return matches[0];
        }
        if (!doDispatch) {
          store.dispatch("userProfilesStore/fetchUserProfile", { username: username }, { root: true });
        }
        return {};
      }
    },
    getGaiaUrl: state => username => {
      let gaiaUrl;
      let profiles = state.userProfiles.filter(
        profile => profile.username === username
      );
      if (profiles.length > 0) {
        let domain = location.origin;
        let profile = profiles[0];
        for (var key in profile.apps) {
          if (key === domain) {
            gaiaUrl = profile.apps[key];
          }
        }
      }
      return gaiaUrl;
    },
    getProfiles: state => {
      return state.userProfiles;
    }
  },
  mutations: {
    addUser(state, userProfile) {
      let index = _.findIndex(state.userProfiles, function(o) {
        return o.username === userProfile.username;
      });
      if (index === -1) {
        if (!userProfile.name) {
          let index = userProfile.username.indexOf(".");
          userProfile.name = userProfile.username.substring(0, index);
        }
        state.userProfiles.push(userProfile);
      }
    },
    addTeamProfile(state, profile) {
      let index = _.findIndex(state.teamProfiles, function(o) {
        return o.id === profile.id;
      });
      if (index === -1) {
        state.teamProfiles.push(profile);
      }
    },
    addNameToList(state, username) {
      let index = _.findIndex(state.namesRequestList, function(u) {
        return u === username;
      });
      if (index === -1) {
        state.namesRequestList.push(username);
      }
    }
  },
  actions: {
    fetchUserProfile({ commit, state, getters }, user) {
      return new Promise(resolve => {
        if (
          !user.username ||
          user.username.length === 0 ||
          user.username.indexOf("not given") > -1
        ) {
          resolve();
        }
        let up = getters.getProfile(user.username, true);
        if (up && up.username) {
          resolve(up);
        } else {
          let index = _.findIndex(state.namesRequestList, function(username) {
            return username === user.username;
          });
          if (index === -1) {
            commit("addNameToList", user.username);
            userProfilesService.fetchUserProfile(
              user.username,
              function(userProfile) {
                commit("addUser", userProfile);
                resolve(userProfile);
              },
              function() {
                resolve();
              }
            );
          } else {
            resolve();
          }
        }
      });
    }
  }
};
export default userProfilesStore;
