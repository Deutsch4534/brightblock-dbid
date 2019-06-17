<template>
<div>
  <div class="bg-white mt-5 p-3" v-if="loading">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <mdb-row v-else>
    <div class="col-12 py-5">
      <!-- Supported elements -->
      <confirmation-modal :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
      <form class="needs-validation form-transparent" novalidate v-on:submit.prevent="checkForm" id="itemForm">
        <!-- item type -->
        <div class="row">
          <div class="col-8 mb-4">
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors" :key="error.id">{{ error }}</li>
              </ul>
            </p>
            <div class="form-row mb-2"><h5>{{formTitle}}</h5></div>
            <div class="form-row mb-3">
              <input type="text" class="form-control" id="validationCustom01" :placeholder="'Item Title (' + limits.title + ' chars max)'" v-model="item.title" required :maxlength="limits.title">
              <div class="invalid-feedback">Please enter a title!</div>
            </div>
            <div class="form-row mb-3">
                <!--<label for="validationCustom02">Description of Item</label>-->
                <textarea type="text" class="form-control" id="validationCustom02" :placeholder="'Description of the Item (' + limits.description + ' chars max)'" v-model="item.description" required :maxlength="limits.description"></textarea>
                <div class="invalid-feedback">
                  Please enter a description!
                </div>
            </div>
            <div class="form-row mb-2"><h5>categories</h5></div>
            <div class="form-row mb-2">
              <div id="vc-040-error" class="invalid-feedback">
                Please enter or select some categories!
              </div>
              <taxonomy @closeKeywords="closeKeywords" :initKeywords="item.keywords"/>
            </div>

            <!-- Right column - image drop -->
            <div class="form-row mb-2" v-if="showMedia">
              <h5>images</h5>
              <media-files-upload :parentalError="parentalError" :contentModel="contentModel3" :mediaFiles="mediaFiles3" :limit="5" :sizeLimit="2500" :mediaTypes="'image'" @updateMedia="setByEventLogo3($event)"/>
              <media-files-upload :contentModel="contentModel2" :mediaFiles="mediaFiles2" :limit="5" :sizeLimit="2500" :mediaTypes="'image,doc'" @updateMedia="setByEventLogo2($event)"/>
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
                <button type="submit" class="btn btn-sm btn-primary" @click.prevent="checkForm">Save</button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  </mdb-row>
</div>
</template>

<script>
import { mdbIcon, mdbPopover, mdbCol, mdbRow, mdbContainer, mdbBtn } from "mdbvue";
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
      mdbContainer,
      mdbIcon,
      mdbPopover,
      mdbCol,
      mdbRow,
      mdbBtn
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
        limits: {
          title: 50,
          description: 1000,
          maxEditions: 10,
          keywords: 100
        },
        contentModel2: {
          title: "Ownership Files",
          errorMessage: "",
          popoverBody: "Provide bills of sale, receipts, images or video clips which prove your ownership (evidence of this data can optionally be stored in the blockchain).<br/><br/>Up to 5 images / documents.",
        },
        contentModel3: {
          title: "Gallery Images",
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
          this.showMedia = true;
          this.loading = false;
        })
      } else {
        this.item = this.$store.getters["myItemStore/myItemOrDefault"](this.itemId);
        this.item.owner = this.myProfile.username;
        this.showMedia = true;
      }
    },
    computed: {
      mediaFiles2() {
        let files = [];
        if (this.item.supportingDocuments && this.item.supportingDocuments.length  > 0) {
          files = this.item.supportingDocuments;
        }
        return files;
      },
      mediaFiles3() {
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
      setByEventLogo2 (mediaObjects) {
        this.item.supportingDocuments = mediaObjects.media;
      },
      setByEventLogo3 (mediaObjects) {
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
