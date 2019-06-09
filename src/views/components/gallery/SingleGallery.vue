<template>
  <mdb-col sm="6" md="4" lg="3" class="mb-3 d-flex">
    <confirmation-modal v-if="showModal" :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <mdb-card class="bg-transparent mb-5 w-100">
      <mdb-view hover>
        <mdb-card-image :src="logo" alt="Gallery cover image" class="img-square"></mdb-card-image>
        <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
      </mdb-view>
      <mdb-card-body class="px-0 pb-2 mb-0">
        <mdb-card-title :class="classContext">
           {{gallery.title}}
          </mdb-card-title>
        <mdb-card-text :class="classContext">{{gallery.description}}</mdb-card-text>
      </mdb-card-body>
      <div class="card-buttons d-flex align-items-end justify-content-between flex-wrap">
        <router-link v-if="isAdministrator" :to="editUrl"><mdb-btn rounded color="white" size="sm" class="mx-0">Manage</mdb-btn></router-link>
        <a @click="gotoGallery"><mdb-btn rounded color="white" size="sm" class="mx-0">Open</mdb-btn></a>
      </div>
    </mdb-card>
  </mdb-col>
</template>

<script>
import { mdbCard, mdbIcon, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText, mdbBtn, mdbCol, mdbView, mdbMask } from 'mdbvue';
import { mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle } from 'mdbvue';
import ConfirmationModal from "@/views/components/utils/ConfirmationModal";

// noinspection JSUnusedGlobalSymbols
export default {
  name: "SingleGallery",
  components: {
    mdbCard,
    ConfirmationModal,
    mdbIcon,
    mdbCardImage,
    mdbCardBody,
    mdbCardTitle,
    mdbCardText,
    mdbBtn,
    mdbCol,
    mdbView,
    mdbMask,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle
  },
  props: {
    gallery: {
      type: Object,
      default() {
        return {};
      }
    },
    context: {
      type: String,
      default() {
        return "search";
      }
    },
  },
  data() {
    return {
      showModal: false,
      modalTitle: "Delete..",
      modalContent: "<p>Can't delete galleries just - please stay tuned for this.</p>",
    };
  },
  methods: {
    closeModal: function() {
      this.showModal = false;
    },
    gotoGallery(date) {
      this.$router.push("/gallery/" + this.gallery.owner + "/" + this.gallery.galleryId);
    },
    deleteMe() {
       this.showModal = true;
    }
  },
  computed: {
    logo() {
      if (this.gallery.coverImage && this.gallery.coverImage.dataUrl) {
        return this.gallery.coverImage.dataUrl;
      }
      return require("@/assets/img/missing/artwork-missing.jpg");
    },
    classContext() {
      if (this.context === "search" || this.context === "online-gallery") {
        return "text-white";
      } else {
        return "";
      }
    },
    isAdministrator() {
      let userProfile = this.$store.getters["myAccountStore/getMyProfile"];
      return this.gallery.owner === userProfile.username;
    },
    editUrl() {
      return `/gallery/update/${this.gallery.galleryId}`;
    },
    newAuctionUrl() {
      return `/my-auctions/upload?galleryId=${this.gallery.galleryId}`;
    }
  }
};
</script>
<style scoped>
  .dropdown-toggle {
    padding: 5px 10px;
    margin: 0px;
  }
  .dropdown-toggle::after {
      display: none;
  }
  </style>
