import _ from "lodash";

const peerToPeerStore = {
  namespaced: true,
  state: {
    peers: []
  },
  getters: {
    getProfile: state => username => {
      if (!username) {
        return {};
      }
      let matches = state.userProfiles.filter(
        profile => profile.username === username
      );
      if (matches.length > 0) {
        return matches[0];
      } else {
        return {};
      }
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
        state.userProfiles.push(userProfile);
      }
    }
  },
  actions: {}
};
export default peerToPeerStore;
