import _ from "lodash";
import store from "@/storage/store";
import bitcoinService from "brightblock-lib/src/services/bitcoinService";
import moment from "moment";
import invoiceService from "brightblock-lib/src/services/invoiceService";

const invoiceStore = {
  namespaced: true,
  state: {
    invoices: {
      records: []
    },
    transactions: null
  },
  getters: {
    getInvoices: state => {
      return state.invoices.records;
    },
    getInvoicesRaw: state => {
      return state.invoices;
    },
    getInvoiceById: state => invoiceId => {
      let records = state.invoices.records.filter(invoice => invoice.invoiceId === invoiceId);
      if (!records || records.length === 0) {
        // allows for passing in the artwork id.
        records = state.invoices.records.filter(invoice => invoice.artworkId === invoiceId);
      }
      if (records && records.length === 1) {
        return records[0];
      }
      return null;
    },
    getInvoicesByState: state => istate => {
      let invoices = state.invoices.records.filter(
        invoice => invoice.state === istate
      );
      return invoices;
    }
  },
  mutations: {
    invoicesRootFile(state, invoicesRootFile) {
      state.invoices = invoicesRootFile;
    },
    transactions(state, transactions) {
      state.transactions = transactions;
    },
    deleteInvoice(state, invoiceId) {
      let index = _.findIndex(state.invoices.records, function(u) {
        return u.invoiceId === invoiceId;
      });
      if (index > -1) {
        state.invoices.records.splice(index, 1);
      }
    },
    addInvoice(state, invoice) {
      if (!invoice || !invoice.invoiceId) {
        return;
      }
      let index = _.findIndex(state.invoices.records, function(u) {
        return u.invoiceId === invoice.invoiceId;
      });
      if (index < 0) {
        state.invoices.records.splice(0, 0, invoice);
      } else {
        state.invoices.records.splice(index, 1, invoice);
      }
    }
  },
  actions: {
    fetchInvoices({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          let now = moment({}).valueOf();
          _.forEach(invoicesRootFile, function(invoice) {
            let interval = (now - invoice.timestamp) / 1000;
            if (interval > 60) {
              store.dispatch("invoiceStore/deleteInvoice", invoice.invoiceId);
            }
          });
          commit("invoicesRootFile", invoicesRootFile);
        });
      });
    },
    checkPayment({ commit, state, getters}, invoiceId) {
      let invoice = getters.getInvoiceById(invoiceId);
      return new Promise(resolve => {
        if (invoice.buyerTransaction) {
          bitcoinService.checkTransaction({txid: invoice.buyerTransaction.txid}, function(transaction) {
            if (transaction) {
              invoice.buyerTransaction.confirmations = transaction.result.confirmations;
              commit("addInvoice", invoice);
              let invoices = getters["getInvoicesRaw"];
              invoiceService.saveInvoiceClaim(invoices, invoice, function(res) {
                resolve(invoice);
              });
            }
          });
        } else {
          resolve();
        }
      });
    },
    checkSettlement({ commit, state, getters}, invoiceId) {
      let invoice = getters.getInvoiceById(invoiceId);
      if (!invoice) {
        return;
      }
      return new Promise(resolve => {
        if (invoice.sellerTransaction) {
          bitcoinService.checkTransaction({txid: invoice.sellerTransaction.txid}, function(transaction) {
            if (transaction) {
              invoice.sellerTransaction.confirmations = transaction.result.confirmations;
              commit("addInvoice", invoice);
              let invoices = getters["getInvoicesRaw"];
              invoiceService.saveInvoiceClaim(invoices, invoice, function(res) {
                resolve(invoice);
              });
            }
          });
        } else {
          resolve();
        }
      });
    },
    fetchInvoice({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        // invoices are fetched on page load - see main.js
        invoiceService.initInvoiceData(function(invoicesRootFile) {
          commit("invoicesRootFile", invoicesRootFile);
          let invoiceClaim = getters.getInvoiceById(invoiceId);
          if (invoiceClaim) {
            resolve(invoiceClaim);
            if (!invoiceClaim.state === "unpaid") {
            }
          } else {
            resolve(invoiceClaim);
          }
        });
      });
    },
    deleteInvoice({ commit, state, getters}, invoiceId) {
      return new Promise(resolve => {
        // invoices are fetched on page load - see main.js
        commit("deleteInvoice", invoiceId);
        let invoices = store.getters["invoiceStore/getInvoicesRaw"];
        invoiceService.deleteInvoice(invoices, function(invoicesRootFile) {
          resolve();
        });
      });
    },
    prepareNewInvoice({ commit, state, getters}, data) {
      let artwork = data.artwork;
      return new Promise(resolve => {
        store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.gallerist }, { root: true }).then(profile => {
          let gallerist = profile;
          store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.owner }, { root: true }).then(profile => {
            let seller = profile;
            store.dispatch("userProfilesStore/fetchUserProfile", { username: artwork.artist }, { root: true }).then(profile => {
              let artist = profile;
              let buyer = store.getters["myAccountStore/getMyProfile"];
              let invoiceClaim = invoiceService.createInvoiceClaim(buyer, gallerist, seller, artist, artwork);
              invoiceClaim.invoiceRates = store.state.constants.invoiceRates;
              let fiatRate = store.getters["conversionStore/getFiatRate"](artwork.saleData.fiatCurrency);
              invoiceClaim.invoiceAmounts = invoiceService.getInvoiceAmounts(fiatRate, invoiceClaim.invoiceRates, artwork.saleData, artwork.gallerist, artwork.artist !== artwork.owner);
              if (data.saveInvoice) {
                commit("addInvoice", invoiceClaim);
                let invoices = getters["getInvoicesRaw"];
                invoiceService.saveInvoiceClaim(invoices, invoiceClaim, function(res) {
                  resolve(invoiceClaim);
                });
              } else {
                resolve(invoiceClaim);
              }
            });
          });
        });
      });
    },
    paySeller({ commit, state, getters}, invoice) {
      return new Promise(resolve => {
        if (!invoice.sellerTransaction) {
          // settlement is after successful pay seller.
          // can't settle until the buyers original tx is confirmed
          bitcoinService.paySeller(invoice, function(transaction) {
            if (transaction && transaction.sentTx) {
              invoice.state = "settling";
              invoice.sellerTransaction = {};
              invoice.sellerTransaction.txid = transaction.sentTx;
              invoice.sellerTransaction.confirmations = 0;
              commit("addInvoice", invoice);
              let invoices = getters["getInvoicesRaw"];
              invoiceService.saveInvoiceClaim(invoices, invoice, function() {
                // invoiceService.transferArtworkToBuyer(invoice, true, function(artwork) {
                // need to wait for confirmations before transferring...
                console.log("settling purchase for artwork: " + invoice.title);
                commit("addInvoice", invoice);
                resolve(invoice);
                // });
              }, function() {
                resolve();
              });
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
  }
};
export default invoiceStore;
