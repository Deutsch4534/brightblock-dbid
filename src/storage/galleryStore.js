// myArtworksStore.js
import galleryService from "@/services/galleryService";
import searchIndexService from "@/services/searchIndexService";
import _ from "lodash";

const galleryStore = {
  namespaced: true,
  state: {
    myGalleries: [],
    userGalleries: []
  },
  getters: {
    getGallery: state => (username, galleryId) => {
      let gallery = _.find(state.userGalleries, function(o) {
        return o.galleryId === galleryId;
      });
      return gallery;
    },
    getMyGallery: state => galleryId => {
      let gallery = _.find(state.myGalleries.records, function(o) {
        return o.galleryId === galleryId;
      });
      return gallery;
    },
    getMyGalleries: state => {
      return state.myGalleries;
    },
    getSearchResults: state => {
      return state.userGalleries;
    }
  },
  mutations: {
    pushUserGalleries(state, userGalleries) {
      state.userGalleries = userGalleries;
    },
    pushUserGallery(state, userGallery) {
      state.userGalleries.push(userGallery);
    },
    pushMyGalleries(state, myGalleries) {
      state.myGalleries = myGalleries;
    },
    pushMyGallery(state, gallery) {
      let index = _.findIndex(state.myGalleries.records, function(o) {
        return o.galleryId === gallery.galleryId;
      });
      if (index === -1) {
        state.myGalleries.records.splice(0, 0, gallery);
      } else {
        state.myGalleries.records.splice(index, 1, gallery);
      }
    },
  },
  actions: {

    fetchMyGallery({ commit, getters, dispatch }, galleryId) {
      return new Promise(resolve => {
        let gallery = getters.getMyGallery(galleryId);
        if (gallery && gallery.shippingAddress) {
          resolve(gallery);
        } else {
          dispatch("fetchMyGalleries").then(galleries => {
            let index = _.findIndex(galleries, function(o) {
              return o.galleryId === galleryId;
            });
            if (index === -1) {
              resolve();
            } else {
              galleryService.fetchGalleryUserDataFromGaia(galleries[index]).then(gallery => {
                commit("pushMyGallery", gallery);
                resolve(gallery);
              });
            }
          });
        }
      });
    },

    fetchGallery({ commit, getters, dispatch }, data) {
      return new Promise(resolve => {
        let gallery = getters.getGallery(data.gallerist, data.galleryId);
        if (gallery) {
          resolve(gallery);
        } else {
          // let query = "(id:" + data.galleryId + ")";
          // searchIndexService.searchDappsIndex(location.hostname, "gallery", "facet", query).then(galleries => {
          searchIndexService.searchDappsIndex(location.hostname, "gallery", "id", data.galleryId).then(galleries => {
            if (galleries) {
              let index = _.findIndex(galleries, function(o) {
                return Number(o.id) === data.galleryId;
              });
              if (index === -1) {
                resolve();
              } else {
                let gid = galleries[index];
                gid.galleryId = Number(gid.id);
                let gallery = getters.getGallery(gid.owner, gid.galleryId);
                if (gallery) {
                  resolve(gallery);
                } else {
                  galleryService.fetchGalleryUserDataFromGaia(gid).then(gallery => {
                    commit("pushUserGallery", gallery);
                    resolve(gallery);
                  });
                }
              }
            } else {
              resolve();
            }
          });
        }
      });
    },

    fetchOnlineGalleries({ commit, getters, dispatch }, criteria) {
      return new Promise(resolve => {
        let domain = location.hostname;
        searchIndexService.searchDappsIndex(domain, "gallery", criteria.field, criteria.query).then(galleries => {
          if (!galleries || galleries.length === 0) {
            commit("pushUserGalleries", []);
            resolve();
          }
          _.each(galleries, function(gid) {
            gid.galleryId = Number(gid.id);
            let gallery = getters.getGallery(gid.owner, gid.galleryId);
            if (gallery) {
              resolve(gallery);
            } else {
              galleryService.fetchGalleryUserDataFromGaia(gid).then(gallery => {
                commit("pushUserGallery", gallery);
                resolve(gallery);
              });
            }
          });
        });
      });
    },

    fetchMyGalleries({ state, commit }) {
      return new Promise(resolve => {
        if (state.myGalleries.records && state.myGalleries.records.length > 0) {
          resolve(state.myGalleries.records);
        }
        galleryService.initGalleryData().then(galleries => {
          commit("pushMyGalleries", galleries);
          if (galleries) {
            _.forEach(galleries.records, function(galleryIndexData) {
              galleryService.fetchGalleryUserDataFromGaia(galleryIndexData).then(gallery => {
                commit("pushMyGallery", gallery);
              });
            });
            resolve(galleries.records);
          } else {
            resolve();
          }
        });
      });
    },

    uploadOrUpdateGallery({ state, commit }, gallery) {
      return new Promise(resolve => {
        galleryService.uploadOrUpdateGallery(state.myGalleries, gallery).then(gallery => {
          commit("pushMyGallery", gallery);
          resolve(gallery);
        });
      });
    },

  }
};
export default galleryStore;
