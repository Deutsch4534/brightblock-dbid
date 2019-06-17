import SHA256 from "crypto-js/sha256";
import _ from "lodash";
import settings from "./settings";
import moment from "moment";
import bitcoin from "bitcoinjs-lib";
import bitcoinMessage from "bitcoinjs-message";
import bs58check from "bs58check";
import moneyUtils from "./moneyUtils";

const utils = {
  dt_Offset(serverTime, compareTime, webcast) {
    let message = "Starts in: ";
    if (!webcast) {
      message = "Bidding ends: ";
    }
    if (serverTime > compareTime) {
      message = "Finished: ";
    }
    let now = moment(serverTime);
    let starts = moment(compareTime);
    let days = starts.diff(now, "days");
    if (days !== 0) {
      message += Math.abs(days) + " days ";
    }
    starts = starts.subtract(days, "day");
    let hours = starts.diff(now, "hours");
    if (hours !== 0) {
      message += Math.abs(hours) + " hours ";
    }
    starts = starts.subtract(hours, "hour");
    let mins = starts.diff(now, "minutes");
    if (mins !== 0) {
      message += Math.abs(mins) + " mins ";
    }
    starts = starts.subtract(mins, "minute");
    let seconds = starts.diff(now, "seconds");
    message += Math.abs(seconds) + " secs ";
    if (serverTime > compareTime) {
      message += " ago.";
    }
    return message;
  },

  buildWebrtcSessionData(connection, data) {
    let pairs = data.split(",");
    let username = pairs[0].split("=")[1];
    let auctionId = pairs[1].split("=")[1];
    return { connection: connection, username: username, auctionId: auctionId };
  },

  buildBitcoinHash(item) {
    let hashBase;
    if (item.supportingDocuments && item.supportingDocuments.length > 0) {
      hashBase = item.owner + "::" + item.id + "::" + item.supportingDocuments;
    } else {
      hashBase = item.owner + "::" + item.id;
    }
    return SHA256(hashBase).toString();
  },

  initialisePurchaseCycle: function(item, otherData) {
    let invoiceRates = settings.invoiceRates;
    let amounts = utils.getAmounts(otherData.fiatRate, invoiceRates, item.saleData, item.gallerist, item.artist !== item.owner);
    let residuals = [];
    let objectIdent = "item_::_" + item.id;
    if (otherData.gallerist) {
      residuals.splice(0, 0, {
        label: objectIdent + "_::_gallerist",
        did: otherData.gallerist.username,
        rate: invoiceRates.galleryResidualFee,
        chainData: {
          bitcoinAddress: (otherData.gallerist.publicKeyData) ? otherData.gallerist.publicKeyData.bitcoinAddress : null
        },
        amountFiat: amounts.fiatGalleryAmount,
        amountBitcoin: amounts.bitcoinGalleryAmount
      });
    }
    if (otherData.creator) {
      residuals.splice(0, 0, {
        label: objectIdent + "_::_creator",
        did: otherData.creator.username,
        rate: invoiceRates.artistResidualFee,
        chainData: {
          bitcoinAddress: (otherData.creator.publicKeyData) ? otherData.creator.publicKeyData.bitcoinAddress : null
        },
        amountFiat: amounts.fiatArtistAmount,
        amountBitcoin: amounts.bitcoinArtistAmount
      });
    }
    let seller = {
      label: objectIdent + "_::_seller",
      did: otherData.seller.username,
      chainData: {
        bitcoinAddress: (otherData.seller.publicKeyData) ? otherData.seller.publicKeyData.bitcoinAddress : null
      },
      amountFiat: amounts.fiatAmount,
      amountBitcoin: amounts.bitcoinAmount
    };
    let buyer = {
      label: objectIdent + "_::_buyer",
      did: otherData.buyer.username,
      chainData: {
        bitcoinAddress: (otherData.buyer.publicKeyData) ? otherData.buyer.publicKeyData.bitcoinAddress : null
      },
      amountFiat: amounts.totalFiat,
      amountBitcoin: amounts.totalBitcoin
    };
    let platform = {
      label: objectIdent + "_::_platform",
      did: null,
      rate: invoiceRates.platformFee,
      chainData: {
        bitcoinAddress: invoiceRates.platformAddress
      },
      amountFiat: amounts.fiatPlatformAmount,
      amountBitcoin: amounts.bitcoinPlatformAmount
    };
    return {
      currency: amounts.fiatCurrency,
      paymentAddress: null,
      platform: platform,
      seller: seller,
      buyer: buyer,
      residuals: residuals,
    };
  },
  getAmounts: function(fiatRate, invoiceRates, saleData, includeGallery, includeArtist) {
    try {
      let bitcoinAmount = moneyUtils.valueInBitcoin(saleData.fiatCurrency, saleData.amount, fiatRate);

      let fiatPlatformAmount = moneyUtils.rateInFiat(saleData.amount, invoiceRates.platformFee);
      let bitcoinPlatformAmount = moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.platformFee);
      let fiatArtistAmount = (includeArtist) ? moneyUtils.rateInFiat(saleData.amount, invoiceRates.artistResidualFee) : 0;
      let bitcoinArtistAmount = (includeArtist) ? moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.artistResidualFee) : 0;
      let fiatGalleryAmount = (includeGallery) ? moneyUtils.rateInFiat(saleData.amount, invoiceRates.galleryResidualFee) : 0;
      let bitcoinGalleryAmount = (includeGallery) ? moneyUtils.rateInBitcoin(bitcoinAmount, invoiceRates.galleryResidualFee) : 0;

      let totalFiat = moneyUtils.round(saleData.amount + fiatPlatformAmount + fiatArtistAmount + fiatGalleryAmount, 8);
      let totalBitcoin = moneyUtils.round(bitcoinAmount + bitcoinPlatformAmount + bitcoinGalleryAmount + bitcoinArtistAmount, 8);
      return {
        bitcoinAmount: bitcoinAmount,
        fiatAmount: saleData.amount,
        fiatPlatformAmount: fiatPlatformAmount,
        bitcoinPlatformAmount: bitcoinPlatformAmount,
        fiatArtistAmount: fiatArtistAmount,
        bitcoinArtistAmount: bitcoinArtistAmount,
        fiatGalleryAmount: fiatGalleryAmount,
        bitcoinGalleryAmount: bitcoinGalleryAmount,
        fiatCurrency: saleData.fiatCurrency,
        totalFiat: totalFiat,
        totalBitcoin: totalBitcoin,
      };
    } catch (err) {
      return null;
    }
  },

  convertFromBlockstack: function(record) {
    if (!record.indexData.owner || !record.indexData.id) {
      throw new Error("Owner and id must be present.");
    }
    if (!record.provData) {
      record.provData = {};
    }
    if (!record.provData.images) {
      record.provData.images = [];
    }
    if (!record.provData.supportingDocuments) {
      record.provData.supportingDocuments = [];
    }
    let itemData = this.getItemData(record.provData);
    let bitcoinTx = record.indexData.bitcoinTx;
    if (record.indexData.saleData && record.indexData.saleData.bitcoinTx) {
      bitcoinTx = record.indexData.saleData.bitcoinTx;
      if (record.indexData.bitcoinTx) {
        bitcoinTx = record.indexData.bitcoinTx;
      }
    }
    return _.merge(itemData, {
      id: record.indexData.id,
      title: record.indexData.title,
      description: record.indexData.description,
      updated: record.indexData.updated,
      keywords: record.indexData.keywords,
      buyer: record.indexData.buyer,
      bitcoinTx: bitcoinTx,
      status: record.indexData.status,
      saleHistories: record.indexData.saleHistories,
      owner: record.indexData.owner,
      saleData: record.indexData.saleData,
    });
  },

  convertToBlockstack: function(item) {
    if (!item.owner || !item.id) {
      throw new Error("Owner and id must be present.");
    }
    let indexData = {
      id: item.id,
      title: item.title,
      description: item.description,
      updated: item.updated,
      keywords: item.keywords,
      buyer: item.buyer,
      status: item.status,
      bitcoinTx: item.bitcoinTx,
      saleHistories: item.saleHistories,
      owner: item.owner,
    };

    if (item.saleData) {
      indexData.saleData = item.saleData;
    } else {
      indexData.saleData = moneyUtils.buildInitialSaleData();
    }

    let provData = {
      id: item.id,
      images: item.images,
      coa: item.coa,
      created: item.created,
      supportingDocuments: item.supportingDocuments,
    };
    if (item.supportingDocuments && item.supportingDocuments.length > 0) {
      provData.derivedTimestamp = utils.buildItemHash(
        item.supportingDocuments[0].dataUrl
      );
    }
    return {
      indexData: indexData,
      provData: provData
    };
  },

  getItemData: function(provData) {
    let itemData = {
      coa: provData.coa,
      images: provData.images,
      supportingDocuments: provData.supportingDocuments,
      created: provData.created,
    };
    if (
      provData.supportingDocuments &&
      provData.supportingDocuments[0] &&
      provData.supportingDocuments[0].dataUrl.length > 0
    ) {
      itemData.timestamp = utils.buildItemHash(
        provData.supportingDocuments[0].dataUrl
      );
    } else {
      provData.supportingDocuments = [];
    }
    return itemData;
  },

  signBitcoin: function(privkey, message) {
    var keyPair = bitcoin.ECPair.fromWIF(privkey);
    // console.log(keyPair)
    var privateKey = keyPair.privateKey;
    var signature = bitcoinMessage.sign(
      message,
      privateKey,
      keyPair.compressed
    );
    return signature.toString("base64");
  },

  getHashPreImagePair: function(preImage) {
    if (!preImage) {
      preImage = String(Math.random());
    }
    let hashed = SHA256(preImage).toString();
    return {
      preImage: preImage,
      preImageHash: hashed
    };
  },

  /**
   * Sign the given hex-encoded bytes.
   */
  verifySignature: function(publicKey, signature, message) {
    // TODO: verifying the signature doesn't work but needs to at some point..
    publicKey = bs58check.encode(publicKey); // tried also keypair.publicKey from above
    console.log(bitcoinMessage.verify(message, publicKey, signature));
  }
};

export default utils;
