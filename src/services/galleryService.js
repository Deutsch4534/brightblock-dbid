import { getFile, putFile } from "blockstack";
import moment from "moment";
import searchIndexService from "./searchIndexService";
import { CONSTANTS } from "@/storage/constants";
import _ from "lodash";

const galleryService = {
  initGalleryData: function() {
    return new Promise((resolve, reject) => {
      const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
      getFile(galleriesRootFileName, { decrypt: false }).then(function(file) {
        if (!file) {
          var now = moment({}).valueOf();
          let newRootFile = {
            created: now,
            records: []
          };
          putFile(galleriesRootFileName, JSON.stringify(newRootFile), {encrypt: false}).then(function(file) {
            resolve(newRootFile);
          });
        } else {
          let rootFile = JSON.parse(file);
          resolve(rootFile);
        }
      });
    });
  },

  updateMyGalleries: function(rootFile, gUserData) {
    const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
    if (!rootFile.created) {
      rootFile.created = moment({}).valueOf();
    }
    putFile(galleriesRootFileName, JSON.stringify(rootFile), {encrypt: false}).then(res => {
      const galleryFileName = CONSTANTS.gIndexDataPrefix + gUserData.galleryId + '.json';
      putFile(galleryFileName, JSON.stringify(gUserData), {encrypt: false});
    });
  },

  splitGidGud: function(gallery) {
    let gid = _.pick(gallery, ['galleryId', 'title', 'description', 'keywords', 'privacy', 'owner', 'galleryType']);
    let gud = _.pick(gallery, ['galleryId', 'coverImage', 'emailAddress', 'shippingAddress', 'bitcoinAddress', '', '']);
    return {gIndexData: gid, gUserData: gud};
  },

  mergeGidGud: function(gid, gud) {
    if (gid.galleryId !== gud.galleryId) {
      throw new Error("Something wrong with this data.");
    }
    let gallery = _.pick(gid, ['title', 'description', 'keywords', 'privacy', 'owner', 'galleryType']);
    gallery = _.merge(gallery, _.pick(gud, ['galleryId', 'coverImage', 'emailAddress', 'shippingAddress', 'bitcoinAddress', '', '']));
    return gallery;
  },

  fetchGalleriesFromGaia: function(username) {
    return new Promise((resolve, reject) => {
      const galleriesRootFileName = CONSTANTS.galleriesRootFileName;
      let options = {decrypt: false};
      if (username) {
        options.username = username;
      }
      getFile(galleriesRootFileName, options).then(function(file) {
        if (file) {
          let rootFile = JSON.parse(file);
          resolve(rootFile.records);
        }
      })
        .catch(function() {
          resolve({});
        });
    });
  },

  fetchGalleryUserDataFromGaia: function(gid) {
    return new Promise((resolve, reject) => {
      let id = (gid.id) ? Number(gid.id) : Number(gid.galleryId);
      const galleryFileName = CONSTANTS.gIndexDataPrefix + id + '.json';
      let options = {decrypt: false, username: gid.owner};
      getFile(galleryFileName, options).then(function(file) {
        if (file) {
          let gud = JSON.parse(file);
          resolve(galleryService.mergeGidGud(gid, gud));
        }
      })
        .catch(function() {
          resolve();
        });
    });
  },

  uploadOrUpdateGallery: function(myGalleries, gallery) {
    return new Promise((resolve, reject) => {
      if (!gallery.galleryId) {
        gallery.galleryId = moment({}).valueOf();
      }
      if (!gallery.owner) {
        throw new Error("Expected a gallery owner to be set.");
      }
      if (!gallery.shippingAddress) {
        gallery.shippingAddress = {};
      }
      let index = _.findIndex(myGalleries.records, function(o) {
        return o.galleryId === gallery.galleryId;
      });
      let gidgud = galleryService.splitGidGud(gallery);
      if (index < 0) {
        myGalleries.records.splice(0, 0, gidgud.gIndexData);
      } else {
        myGalleries.records.splice(index, 1, gidgud.gIndexData);
      }
      galleryService.updateMyGalleries(myGalleries, gidgud.gUserData);
      if (gallery.privacy === "private") {
        searchIndexService.removeRecord("id", gallery.galleryId);
      } else {
        searchIndexService.addRecord("gallery", gallery);
      }
      resolve(gallery);
    });
  }
};
export default galleryService;
