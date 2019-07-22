<template>
<div>
  <div class="d-flex justify-content-center" role="status" v-if="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div v-else>
    <!-- Supported elements -->
    <help-topic-modal class="text-left" :modal="helpModal" :topic="'saving-item'" @closeModal="helpModalClose"/>
    <form class="text-dark text-white needs-validation" novalidate v-on:submit.prevent="checkForm" id="itemForm">
      <!-- item type -->

      <div class="card" v-if="errors.length">
        <div class="card-body">
          <p class="text-capitalize">Please correct the below error(s):</p>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error }}</li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <p class="text-capitalize">Type of item?</p>
          <div class="d-flex justify-content-between">
            <div class="mb-3" style="width: 49%"><span style="text-transform: capitalize;" v-model="medium" @click="medium = 'physical'" :class="(medium === 'physical') ? 'btn btn-block teal lighten-1 text-white' : 'btn btn-block btn-white'" required><span class="d-flex justify-content-between"><span>Physical Item</span> <i class="mt-1 ml-2 fas fa-angle-down"></i></span></span></div>
            <div class="mb-3" style="width: 49%"><span style="text-transform: capitalize;" v-model="medium" @click="medium = 'digital'" :class="(medium === 'digital') ? 'btn btn-block teal lighten-1 text-white' : 'btn btn-block btn-white'" required><span class="d-flex justify-content-between"><span>Digital Item</span> <i class="mt-1 ml-2 fas fa-angle-down"></i></span></span></div>
          </div>
        </div>
      </div>

      <div class="card" v-if="formStage > 0">
        <div class="card-body">
          <p class="text-capitalize">{{medium}} item title and description</p>
          <div class="form-group">
            <input type="text" class="form-control" id="validationCustom01" :placeholder="'Item Title (' + limits.title + ' chars max)'" v-model="item.title" required :maxlength="limits.title">
            <div class="invalid-feedback">Please enter a title!</div>
          </div>
          <div class="form-group">
            <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'Description of the Item (' + limits.description + ' chars max)'" v-model="item.description" required :maxlength="limits.description"></textarea>
            <div class="invalid-feedback">
              Please enter a description!
            </div>
          </div>
        </div>
      </div>

      <div class="card" v-if="formStage > 1">
        <div class="card-body">
          <taxonomy-select @categories="categories" :initCategories="item.keywords"/>
          <div id="vc-040-error" class="invalid-feedback mb-4">
            Please choose closest fitting categories, keywords and tags
          </div>
        </div>
      </div>

      <div class="card" v-if="formStage > 2">
        <div class="card-body">
          <p class="text-capitalize">Images <sup class="text-danger">*</sup></p>
          <media-files-upload :parentalError="parentalError" :contentModel="contentModel3" :mediaFiles="mediaFilesImages" :limit="5" :sizeLimit="2500" :mediaTypes="'image'" @updateMedia="updateMediaImages($event)"/>
          <div id="vc-042-error" class="invalid-feedback">
            Please add some images
          </div>
        </div>
      </div>

      <div class="card" v-if="errors.length">
        <div class="card-body">
          <p class="text-capitalize">Please correct the above error(s):</p>
          <ul>
            <li v-for="error in errors" :key="error.id">{{ error }}</li>
          </ul>
        </div>
      </div>

      <!-- Submit button row -->
      <div class="card" v-if="formStage > 3">
        <div class="card-body">
          <button type="submit" class="btn btn-block btn-md btn-primary" @click.prevent="checkForm">Save & Set Price</button>
        </div>
      </div>

    </form>
  </div>
</div>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";
import { mdbSpinner } from 'mdbvue';
import moment from "moment";
import ConfirmationModal from "@/pages/components/utils/ConfirmationModal";
import TaxonomySelect from "@/pages/components/utils/TaxonomySelect";
import KeywordsEntry from "@/pages/components/utils/KeywordsEntry";
import MediaFilesUpload from "@/pages/components/utils/MediaFilesUpload";
import HelpTopicModal from "@/pages/components/utils/HelpTopicModal";
import _ from "lodash";

  // noinspection JSUnusedGlobalSymbols
  export default {
    name: "ItemUploadForm",
    components: {
      HelpTopicModal,
      TaxonomySelect,KeywordsEntry,
      MediaFilesUpload,
      mdbSpinner,
      mdbContainer,
      mdbIcon,
      mdbPopover,
      mdbCol,
      mdbRow,
      mdbBtn, mdbSpinner
    },
    props: ["itemId", "mode", "formTitle", "myProfile"],
    data() {
      return {
        errors: [],
        loading: true,
        showMedia: false,
        helpModal: false,
        media: this.$store.state.constants.taxonomy.media,
        medium: null,
        mediumLocked: false,
        limits: {
          title: 200,
          description: 1000,
          maxEditions: 10,
          keywords: 1000
        },
        contentModel3: {
          title: null,
          errorMessage: "",
          popoverBody: "Images for potential buyers to see your item from different angles.<br/><br/>Up to 5 (100kb or less) images.",
        },
        parentalError: null,
        showAttachDocs: false,
        alertMessage: null,
        dateError: false,
        created: moment({}).valueOf(),
        item: {},
      };
    },
    mounted() {
      if (this.itemId) {
        this.$store.dispatch("myItemStore/fetchMyItem", this.itemId).then((item) => {
          this.item = item;
          if (this.item) {
            this.created = moment(this.item.created).format("LLLL");
            this.item.owner = this.myProfile.username;
          } else {
            this.$notify({type: 'error', title: 'Update Item', text: 'Unable to find this - please check your selling list in case its been sold?'});
          }
          if (item.medium) {
            this.medium = item.medium;
          }
          this.stripRubbishKeywork(this.item);
          this.showMedia = true;
          this.loading = false;
        })
      } else {
        this.item = this.$store.getters["myItemStore/myItemOrDefault"](this.itemId);
        this.item.owner = this.myProfile.username;
        this.showMedia = true;
        this.loading = false;
      }
    },
    computed: {
      mediaFilesImages() {
        let files = [];
        if (this.item.images && this.item.images.length  > 0) {
          files = this.item.images;
        }
        return files;
      },
      formStage() {
        let stage = 0;
        if (this.medium === "digital" || this.medium === "physical") {
          stage = 1;
        }
        if (this.item.title && this.item.title.length > 0 && this.item.description && this.item.description.length > 0) {
          stage = 2;
        }
        if (this.item.keywords && this.item.keywords.length > 0) {
          stage = 3;
        }
        if (this.item.images && this.item.images.length > 0) {
          stage = 4;
        }
        return stage;
      }
    },
    methods: {
      helpModalClose: function() {
        this.helpModal = false;
      },
      stripRubbishKeywork(item) {
        if (item.keywords && typeof item.keywords === "string") {
          let filtkeys = [];
          let $self = this;
          let keywordNames = item.keywords.split(",");
          _.forEach(keywordNames, function(keywordName) {
            keywordName = keywordName.trim();
            filtkeys.push({level: 3, parent: "Other Categories", name: keywordName});
          });
          this.item.keywords = filtkeys;
        }
      },
      doMedium () {
        this.item.medium = this.medium;
      },
      categories: function(chosen) {
        this.item.keywords = chosen;
        document.getElementById("vc-040-error").style.display = "none";
      },
      info() {
        this.$notify({type: 'success', title: 'Notification 2!', text: 'Hi! I am info message.'});
      },
      removeGallery() {
        this.galleryId = null;
        this.item.galleryId = null;
        this.item.gallerist = null;
        this.$notify({type: 'info', title: 'Gallery Removed', text: 'Item changed back to simple listing - press save!'});
      },
      updateMediaImages (mediaObjects) {
        this.item.images = mediaObjects.media;
        this.parentalError = null;
      },
      upload: function () {
        this.alertMessage =
          "Uploading item to your storage..";
        this.helpModal = true;
        //this.item.keywords = this.$store.getters["contentStore/getParents"](this.item.keywords);
        if (this.mode === "update") {
          this.item.updated = moment({}).valueOf();
          this.$store
            .dispatch("myItemStore/updateItem", {item: this.item, updateProvData: true})
            .then(item => {
              if (item) {
                this.item = item;
                this.helpModal = false;
                this.$store.commit("itemSearchStore/addSearchResult", item);
                this.$store.commit("itemSearchStore/addItem", item);
                this.$store.dispatch("itemSearchStore/searchCategoryPopulations");
                this.$router.push("/my-item/set-price/" + item.id);
              } else {
                this.$notify({type: 'error', title: 'Update Item', text: 'Unable to update your item - please check the image sizes and the form for errors!'});
                this.helpModal = false;
              }
          });
        } else {
          this.item.created = moment({}).valueOf();
          this.item.updated = moment({}).valueOf();
          this.$store
            .dispatch("myItemStore/uploadItem", this.item)
            .then(item => {
              if (item) {
                this.item = item;
                this.helpModal = false;
                this.$store.commit("itemSearchStore/addSearchResult", item);
                this.$store.commit("itemSearchStore/addItem", item);
                this.$store.dispatch("itemSearchStore/searchCategoryPopulations");
                this.$router.push("/my-item/set-price/" + item.id);
              } else {
                this.$notify({type: 'error', title: 'Upload Item', text: 'Unable to upload your item - please check the image sizes and the form for errors!'});
                this.helpModal = false;
              }
            });
        }
      },
      checkForm(event) {
        if (event) {
          event.preventDefault();
          event.target.classList.add('was-validated');
        }
        this.parentalError = null;
        this.showAttachDocs = false;
        this.errors = [];
        document.getElementById("vc-040-error").style.display = "none";
        if (!this.item.title) {
          this.errors.push("title required.");
        }
        if (!this.item.description) {
          this.errors.push("description required.");
        }
        if (!this.item.keywords || this.item.keywords.length === 0) {
          this.errors.push("Please select or add some categories, keywords and tags.");
          document.getElementById("vc-040-error").style.display = "block";
          document.getElementById("vc-040-error").innerHTML = "Choose a category.";
        }
        this.item.medium = this.medium;
        if (!this.item.medium || (this.item.medium !== "physical" && this.item.medium !== "digital")) {
          this.errors.push("Item type needs to be either physical or digital.");
        }
        if (!this.item.owner || this.item.owner.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the owner is missing.");
        }
        if (!this.item.owner || this.item.owner.indexOf(".id") === -1) {
          this.errors.push("Blockstack id of the owner is missing.");
        }
        if (this.item.images.length === 0 || this.item.images.length > 5) {
          this.parentalError = "Please attach 1-5 images of the item.";
          this.errors.push(this.parentalError);
        }
        this.dateError = false;
        if (this.errors.length > 0) {
          return false;
        } else {
          this.upload();
        }
      },
    }
  };
</script>

<style scoped>
  #itemForm .form-group {
    margin-bottom: 1rem;
  }
.active {
  border: 1pt solid blue;
}
</style>
