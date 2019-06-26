<template>
<div>
  <div class="d-flex justify-content-center bg-spinner" v-if="loading">
    <mdb-spinner big multicolor />
  </div>
  <div v-else>
    <!-- Supported elements -->
    <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <form class="text-dark bg-card text-white needs-validation form-transparent" novalidate v-on:submit.prevent="checkForm" id="itemForm">
      <!-- item type -->
      <div class="row">
        <div class="col-12 mb-4">
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error.id">{{ error }}</li>
            </ul>
          </p>
          <div class="form-row mb-3"><h5>{{formTitle}}</h5></div>
          <div class="form-row mb-3">
            <input type="text" class="form-control" id="validationCustom01" :placeholder="'Item Title (' + limits.title + ' chars max)'" v-model="item.title" required :maxlength="limits.title">
            <div class="invalid-feedback">Please enter a title!</div>
          </div>
          <div class="form-row mb-5">
            <!--<label for="validationCustom02">Description of Item</label>-->
            <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'Description of the Item (' + limits.description + ' chars max)'" v-model="item.description" required :maxlength="limits.description"></textarea>
            <div class="invalid-feedback">
              Please enter a description!
            </div>
          </div>

          <div class="form-row mb-3"><h5>Item Type</h5></div>
          <div class="form-row mb-5" v-if="!mediumLocked">
            <select id="validationCustom06-1" @change="doMedium" class="text-black browser-default custom-select" v-model="medium" required>
              <option v-for="(medium) in media" :key="medium.value" :value="medium.value">{{medium.label}}</option>
            </select>
            <div class="invalid-feedback">
              Please enter the artwork medium!
            </div>
          </div>
          <div class="col-4 mb-5" v-else>
            Digital Video
          </div>

          <div class="form-row mb-3"><h5>Categories</h5></div>
          <div class="form-row mb-5">
            <div id="vc-040-error" class="invalid-feedback">
              Please select some categories!
            </div>
            <taxonomy @closeKeywords="closeKeywords" :initKeywords="item.keywords"/>
          </div>

          <div class="form-row mb-3"><h5>Images</h5></div>
          <div class="form-row mb-5">
            <div id="vc-040-error" class="invalid-feedback">
              Please select some categories!
            </div>
            <media-files-upload :parentalError="parentalError" :contentModel="contentModel3" :mediaFiles="mediaFilesImages" :limit="5" :sizeLimit="2500" :mediaTypes="'image'" @updateMedia="updateMediaImages($event)"/>
          </div>

          <p class="mb-3" v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </p>

          <!-- Submit button row -->
          <div class="row">
            <div class="col-12">
              <button type="submit" class="btn btn-sm btn-light" @click.prevent="checkForm">Save</button>
            </div>
          </div>
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
import Taxonomy from "@/pages/components/utils/Taxonomy";
import MediaFilesUpload from "@/pages/components/utils/MediaFilesUpload";

  // noinspection JSUnusedGlobalSymbols
  export default {
    name: "ItemUploadForm",
    components: {
      ConfirmationModal,
      Taxonomy,
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
        showModal: false,
        showKeywords: false,
        modalTitle: "Saving Item",
        modalContent: "<p>Please wait while we update your data.</p>",
        media: this.$store.state.constants.taxonomy.media,
        medium: "physical",
        mediumLocked: false,
        limits: {
          title: 50,
          description: 1000,
          maxEditions: 10,
          keywords: 100
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
            this.created = moment(this.item.created).format();
            this.item.owner = this.myProfile.username;
          } else {
            this.modalContent = "File has not been uploaded.";
            this.showModal = true;
          }
          if (item.medium) {
            this.medium = item.medium;
          }
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
      }
    },
    methods: {
      closeModal: function() {
        this.showModal = false;
      },
      doMedium () {
        this.item.medium = this.medium;
      },
      closeKeywords: function(chosen) {
        this.showKeywords = false;
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
        this.showModal = true;
        if (this.mode === "update") {
          this.item.updated = moment({}).valueOf();
          this.$store
            .dispatch("myItemStore/updateItem", {item: this.item, updateProvData: true})
            .then(item => {
              if (item) {
                this.item = item;
                this.showModal = false;
                this.$router.push("/my-item/set-price/" + item.id);
              } else {
                this.modalContent = "File has not been updated.";
              }
          });
        } else {
          this.item.created = moment({}).valueOf();
          this.item.updated = this.item.created;
          this.$store
            .dispatch("myItemStore/uploadItem", this.item)
            .then(item => {
              if (item) {
                this.item = item;
                this.showModal = false;
                this.$router.push("/my-item/set-price/" + item.id);
              } else {
                this.modalContent = "File has not been uploaded.";
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
        if (this.item.keywords.length === 0) {
          this.errors.push("Please select or add some categories.");
          document.getElementById("vc-040-error").style.display = "block";
          document.getElementById("vc-040-error").innerHTML = "Please select or add some categories.";
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
  #itemForm .form-row {
    margin-bottom: 1rem;
  }
</style>
