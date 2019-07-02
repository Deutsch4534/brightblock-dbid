import _ from "lodash";

const moneyUtils = {
  convertPrices(artwork, blockchainItem, fiatRate, ethToBtc) {
    if (!blockchainItem) {
      return;
    }
    if (!artwork.bcitem) {
      artwork.bcitem = {};
    }
    let priceInWei = blockchainItem.price;
    let precision = 1000000000000000000;
    let priceInEth = priceInWei / precision;
    let fiatCurrency = artwork.saleData.fiatCurrency;
    if (!fiatCurrency) {
      fiatCurrency = "EUR";
    }
    let fiatToBtc = 0;
    let priceInBtc = 0;
    let priceInFiat = 0;
    let symbol = "?";

    if (fiatRate) {
      fiatToBtc = fiatRate["15m"];
      priceInBtc = priceInEth * ethToBtc;
      priceInFiat = priceInBtc * fiatToBtc;
      symbol = fiatRate.symbol;
    }

    _.merge(artwork.bcitem, blockchainItem);
    artwork.bcitem.fiatCurrency = fiatCurrency;
    artwork.bcitem.fiatCurrencySymbol = symbol;
    artwork.bcitem.priceInEth = Math.round(priceInEth * 100000) / 100000;
    artwork.bcitem.priceInFiat = Math.round(priceInFiat * 100) / 100;
    artwork.bcitem.priceInBtc = Math.round(priceInBtc * 100000) / 100000;
  },

  round(value, exp) {
    if (typeof exp === 'undefined' || Number(exp) === 0)
      return Math.round(value);

    value = Number(value);
    exp = Number(exp);

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
      return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(Number((value[0] + 'e' + (value[1] ? (Number(value[1]) + exp) : exp))));

    // Shift back
    value = value.toString().split('e');
    return Number((value[0] + 'e' + (value[1] ? (Number(value[1]) - exp) : -exp)));
  },

  conversionMessage(currency, fiatRate, ethToBtc) {
    try {
      let fiatToBtc = fiatRate["15m"];
      let symbol = fiatRate["symbol"];
      fiatToBtc = Math.round(fiatRate["15m"] * 100) / 100;
      let fiatToEther = fiatRate["15m"] * ethToBtc;
      let conversionMessage =
        "1 Bitcoin = " +
        fiatToBtc +
        " " +
        symbol +
        " / 1 Ether = " +
        fiatToEther +
        " " +
        symbol;
      return conversionMessage;
    } catch (err) {
      return "";
    }
  },

  valueInEther(currency, amount, fiatRate, ethToBtc) {
    try {
      let precision = 100000000;
      let conversion = fiatRate["15m"];
      conversion = conversion * ethToBtc;
      if (typeof amount === "string") {
        amount = Number(amount);
      }
      if (typeof amount === "number") {
        conversion = amount / conversion;
      }
      return Math.round(conversion * precision) / precision;
    } catch (err) {
      return 0;
    }
  },

  valueInEtherFromWei(wei) {
    try {
      let precision = 100000000;
      let eth = wei / 1000000000000000000;
      return Math.round(eth * precision) / precision;
    } catch (err) {
      return 0;
    }
  },

  valueInBitcoinFromWei(wei, fiatRate, ethToBtc) {
    try {
      let precision = 100000000;
      let valueInEther = moneyUtils.valueInEtherFromWei(wei, fiatRate, ethToBtc);
      return Math.round(valueInEther * ethToBtc * precision) / precision;
    } catch (err) {
      return 0;
    }
  },

  valueInWei(currency, amount, fiatRate, ethToBtc) {
    let valueInEther = moneyUtils.valueInEther(currency, amount, fiatRate, ethToBtc);
    return Math.trunc(valueInEther * 1000000000000000000);
  },

  valueInBitcoin(amount, fiatRate) {
    try {
      let fiatToBtc = 0;
      let precision = 100000000;
      let btcToFiat = fiatRate["15m"];
      if (typeof amount === "string") {
        amount = Number(amount);
      }
      if (typeof amount === "number") {
        fiatToBtc = amount / btcToFiat;
      }
      return Math.round(fiatToBtc * precision) / precision;
    } catch (err) {
      return 0;
    }
  },

  rateInBitcoin(bitcoinAmount, percent) {
    let rate = percent * bitcoinAmount / 100;
    return moneyUtils.round(rate, 8);
  },
  rateInFiat(fiatAmount, percent) {
    let rate = percent * fiatAmount / 100;
    return moneyUtils.round(rate, 2);
  },

  buildInitialSaleData() {
    return {
      soid: 0,
      amount: 0,
      reserve: 0,
      increment: 0,
      fiatCurrency: "EUR",
      initialRateBtc: 0,
      initialRateEth: 0,
      amountInEther: 0,
      auctionId: null
    };
  },

  buildSaleDataFromUserInput(data, fiatRate, ethToBtc) {
    try {
      let saleData = {};
      saleData.soid = data.auctionId ? 2 : 1;
      saleData.amount = Number(data.amount);
      saleData.reserve = Number(data.reserve);
      saleData.increment = Number(data.increment);
      saleData.fiatCurrency = data.currency;
      saleData.initialRateBtc = fiatRate["15m"];
      saleData.initialRateEth = ethToBtc;
      saleData.amountInEther = moneyUtils.valueInEther(
        data.currency,
        saleData.amount,
        100000000, fiatRate, ethToBtc
      );
      saleData.auctionId = data.auctionId;
      return saleData;
    } catch (err) {
      // console.log("Warning - data not yet initialised..");
      return {
        soid: -1
      };
    }
  }
};

export default moneyUtils;
