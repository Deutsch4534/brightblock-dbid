<template>
<div class="row">
  <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
  <delete-item-modal :modal="showDeleteModal" :title="modalTitle" :content="modalContent" @deleteItemConfirmed="deleteItemConfirmed"/>

  <div class="col-lg-5 col-xl-4 mb-4">
    <!--Featured image-->
    <item-image-list-view :item="item"/>
  </div>
  <div class="col-lg-7 col-xl-7 ml-xl-4 mb-4">
    <item-action-links :item="item" :itemAction="'manage'" :asset="asset" :buttonMode="false"/>
    <p class="grey-text"><description-container :text="item.description"/></p>
    <p>by <a class="font-weight-bold dark-grey-text">{{ownerProfile.name}}</a>, 11/08/2018</p>
    <p v-if="item.bitcoinTx"><span>registered</span></p>
    <p v-else><span>not registered</span></p>

  </div>
</div>
</template>

<script>
import utils from "@/services/utils";
import notify from "@/notify";
import ethereumService from "@/services/ethereumService";
import ConfirmationModal from "../utils/ConfirmationModal";
import DeleteItemModal from "./DeleteItemModal";
import DescriptionContainer from "@/pages/components/utils/DescriptionContainer";
import ItemImageListView from "./ItemImageListView";
import ItemActionLinks from "./ItemActionLinks";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MyItemManage",
  components: {
    ItemImageListView, DescriptionContainer, ItemActionLinks,
    ConfirmationModal,
    DeleteItemModal,
  },
  props: {
    sellingStatus: "sold",
    itemAction: "manage",
    item: {
      type: Object,
      default() {
        return {};
      }
    },
    asset: {
      type: Object,
      default() {
        return {};
      }
    },
    myProfile: {
      type: Object,
      default() {
        return {};
      }
    },
    width: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      showDeleteModal: false,
      loading: true,
      showRegisterForSale: false,
      showRegisterOnBitcoin: false,
      showGenerateCoA: false,
      showModal: false,
      modalTitle: "Register",
      modalContent: "<p>Transaction sent - confirmation takes ~ 6 blocks which is about an hour..</p>" +
            "<p>Once confirmed you'll be able to generate Certificate of Authenticity.</p>",
      modalTitle1: "Updating Info",
      modalContent1: "<p>Please wait - updating information for your item.</p>",
      modalTitleDelete: "Please Confirm Delete",
      modalContentDelete: "<p class='text-center'>This can't be undone.</p>",
    };
  },
  mounted() {
    // this.item.saleData.fiatCurrency = "GBP";
    this.loading = false;
  },
  methods: {
    deleteItem() {
      this.modalTitle = this.modalTitleDelete;
      this.modalContent = this.modalContentDelete;
      this.showDeleteModal = true;
    },
    deleteItemConfirmed(data) {
      if (data.proceed) {
        this.$store.dispatch("myItemStore/deleteMyItem", this.item.id).then((item) => {
          this.$router.push("/my-items");
          this.showDeleteModal = false;
        });
      } else {
        this.showDeleteModal = false;
      }
    },
    reload: function() {
      this.$emit("reload");
      this.showGenerateCoA = false;
    },
    closeModal: function() {
      this.showModal = false;
    },
    registerSaleInfo: function(data) {
      if (data.operation === "start") {
        this.modalTitle = this.modalTitle1;
        this.modalContent = this.modalContent1;
        this.showModal = true;
      } else {
        this.showModal = false;
        this.showRegisterForSale = false;
      }
    },
    registerBitcoin: function(result) {
      if (result.error) {
        this.modalContent = result.message;
      } else {
        this.modalContent = result.message;
      }
      this.showModal = true;
    },
    removeCoa: function() {
      this.item.coa = null;
      this.modalTitle = this.modalTitle1;
      this.modalContent = this.modalContent1;
      this.showModal = true;
      this.$store.dispatch("myItemStore/updateItem", {item: this.item, updateProvData: true})
        .then((item) => {
          this.$emit("reload");
          this.showModal = false;
          this.showGenerateCoA = false;
          notify.info({
            title: "Register Item.",
            text: "Your user storage has been updated."
          });
        });
    },
    openCoa: function() {
      let pdfWindow = window.open("", "CertificateAuthenticity");
      pdfWindow.document.write("<html><head></head><body><iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(this.item.coa)+"'></iframe></body></html>");
    },
  },
  computed: {
    editable() {
      return this.$store.getters["myItemStore/editable"](this.item.id);
    },
    ownerProfile() {
      return this.$store.getters["userProfilesStore/getProfile"](
        this.item.owner
      );
    }
  }
};
</script>
