<template>
<!-- droppable area 1 -->

<div class="m-0">
  <p>Good quality images make the sale - <a href="/help/topics/tips-for-taking-images" target="_blank"><u>see this guide for help!</u></a></p>
  <p class="text-muted">Up to {{limit}} images each up to {{sizeLimit}} Kb in size.</p>
  <mdb-popover trigger="click" :options="{placement: 'top'}" v-if="contentModel.title">
    <div class="popover">
      <div class="popover-header">
        {{contentModel.title}}
      </div>
      <div class="popover-body" v-html="contentModel.popoverBody">
      </div>
    </div>
    <a @click.prevent="" slot="reference">
      {{contentModel.title}}
      <mdb-icon far icon="question-circle"/>
    </a>
  </mdb-popover>
  <div class="mt-2">
    <div class="invalid-feedback d-block" v-if="showError">
      {{contentModel.errorMessage}}
    </div>
    <div class="invalid-feedback d-block" v-if="parentalError">
      {{parentalError}}
    </div>
    <div class="invalid-feedback d-block" v-if="internalError">
      {{internalError}}
    </div>
    <!-- Drop area -->
    <div class="row mb-3">
      <div class="col-8 mx-0">
        <div class="load-item" v-if="checkQuantity">
          <div class="drop-area" @drop.prevent="loadMediaObjects" @dragover.prevent>
            <p class="drop-label">Drop file</p>
          </div>
        </div>
      </div>
      <div class="col-8">
        <div class="" v-if="checkQuantity">
          <input class="mt-3" type="file" id="file-input" @change.prevent="loadMediaObjects"/>
        </div>
      </div>
      <div class="col-8 text-right">
      </div>
    </div>
  </div>
  <!--
  <div class="row border-bottom pb-2">
    <div v-for="(file, index) in mediaObjects" :key="index" :file="file" class="col-md-4 p-2 border-bottom border">
      <img :src="missing" alt="Card image cap" class="img-fluid" v-if="ispdf(file)">
      <img :src="file.dataUrl" alt="Card image cap" class="img-fluid mb-2" style="max-height: 350px;" v-else-if="isImage(file)">
      <div class="row" id="video-demo-container" v-else-if="isVideo(file)">
        <div class="col-md-6">
          <canvas id="canvas1"></canvas>
        </div>
        <div class="col-md-6">
          <video id="video1" controls style="max-height: 250px;" @loadedmetadata="cover">
              <source type="video/mp4" :src="file.dataUrl">
          </video>
        </div>
      </div>

      <div v-if="ispdf(file)">
        <p class="mb-0 small">{{ file.type }}</p>
      </div>
    </div>
    <div class="col-12 text-right">
      <a class="d-inline-block" @click.prevent="clearMediaObjects" v-if="mediaObjects.length > 0">
        <button class="btn btn-sm btn-light"">Clear Files</button>
      </a>
    </div>
  </div>
  -->

  <div class="container">
    <div class="row">
      <div class="col-md-3 mx-0" sm="4" v-for="(file, index) in mediaObjects" :key="index" :file="file">
        <mdb-card narrow>
          <div class="view view-cascade overlay" v-if="ispdf(file)">
            <img class="card-img-top" :src="missing" alt="Card image cap" style="height: 200px;">
            <a href="#!">
              <div class="mask rgba-white-slight waves-effect waves-light"></div>
            </a>
          </div>
          <div class="view view-cascade overlay" v-else-if="isImage(file)">
            <img class="card-img-top" :src="file.dataUrl" alt="Card image cap" style="height: 200px;">
            <a href="#!">
              <div class="mask rgba-white-slight waves-effect waves-light"></div>
            </a>
          </div>
          <mdb-card-body cascade>
            <h5 class="d-flex justify-content-between teal-text pb-2 pt-1" style="height: 70px;"><strong><small>{{file.name}}</small></strong> <a @click.prevent="clearMediaObject(file.size)"><i class="fas fa-times mt-1 text-danger" style="font-size: 0.8rem;"></i></a> </h5>
            <mdb-card-text>{{file.size}} bytes</mdb-card-text>
          </mdb-card-body>
        </mdb-card>
      </div>
    </div>
  </div>

</div>
<!--/droppable area 1 -->
</template>

<script>
import { mdbIcon, mdbPopover, mdbBtn } from "mdbvue";
import { mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText } from 'mdbvue';

// noinspection JSUnusedGlobalSymbols
export default {
  name: "MediaFilesUpload",
  components: {
    mdbBtn,
    mdbIcon,
    mdbPopover, mdbCard, mdbCardImage, mdbCardBody, mdbCardTitle, mdbCardText
  },
  props: {
    showError: {
      type: Boolean,
      default: () => (false),
      required: false
    },
    sizeLimit: {
      type: Number,
      default: () => (450),
      required: true
    },
    parentalError: {
      type: String,
      default: () => (""),
      required: false
    },
    mediaTypes: {
      type: String,
      default: () => ("image"),
      required: false
    },
    limit: {
      type: Number,
      default: () => (2),
      required: true
    },
    contentModel: {
      type: Object,
      default: () => ({}),
      required: true
    },
    mediaFiles: {
      type: Array,
      default: () => ([]),
      required: false
    }
  },
  data() {
    return {
      mediaObjects: [],
      internalError: null,
      missing: require("@/assets/img/missing/missing.png"),
    };
  },
  created() {
    if (this.mediaFiles && this.mediaFiles.length > 0) {
      Object.assign(this.mediaObjects, this.mediaFiles);
    }
  },
  computed: {
    checkQuantity: function() {
      return this.mediaObjects.length < Number(this.limit);
    },
    columns() {
      return "col-" + this.size;
    }
  },
  methods: {
    clearMediaObject: function(fsize) {
      let index = _.findIndex(this.mediaObjects, function(mo) {
        return mo.size === fsize;
      });
      this.mediaObjects.splice(index, 1);
      this.$emit('updateMedia', {media: this.mediaObjects});
    },
    clearMediaObjects: function() {
      this.mediaObjects = [];
      this.$emit('updateMedia', {media: this.mediaObjects});
    },
    fileType: function(ftype) {
      if (ftype && ftype.startsWith("image")) {
        return ftype.substring(6);
      }
      return ftype;
    },
    cover() {
      let vid = document.querySelector("#video1");
      let cvs = document.querySelector("#canvas1");
      cvs.width = vid.clientWidth;
      cvs.height = vid.clientHeight;
      let cvsCtx = cvs.getContext("2d");
      vid.currentTime = 0;
      let $self = this;
      document.querySelector("#video1").addEventListener('timeupdate', function() {
        // You are now ready to grab the thumbnail from the <canvas> element
        cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height);
        let coverImage = {
          dataUrl: cvs.toDataURL(),
          type: "image/cover"
        };
        $self.$emit('updateMedia', {media: $self.mediaObjects, coverImage: coverImage});
      });
      // cvsCtx.drawImage(vid, 0, 0, cvs.width, cvs.height);
    },
    ispdf(file) {
      try {
        return file.type.indexOf("pdf") > -1;
      } catch (err) {
        return false;
      }
    },
    isImage(file) {
      try {
        let image = file.type.indexOf("img") > -1 ||
              file.type.indexOf("image") > -1 ||
              file.type.indexOf("png") > -1 ||
              file.type.indexOf("jpeg") > -1 ||
              file.type.indexOf("jpg") > -1 ||
              file.type.indexOf("gif") > -1;
        return image;
      } catch (err) {
        return false;
      }
    },
    isVideo(file) {
      try {
        let image = file.type.indexOf("mp4") > -1;
        return image;
      } catch (err) {
        return false;
      }
    },
    isMusic(file) {
      try {
        let image = file.type.indexOf("mp3") > -1;
        return image;
      } catch (err) {
        return false;
      }
    },
    loadMediaObjects: function(e) {
      this.load(e, this.mediaObjects, 1);
    },
    load: function(e, arrayToLoad, limit) {
      let $self = this;
      this.internalError = null;
      let userFiles;
      if (e.dataTransfer) {
        userFiles = e.dataTransfer.files;
      } else {
        userFiles = e.target.files;
      }
      let fileObject = null;
      for (let i = 0; i < userFiles.length; i++) {
        if (i === limit) {
          break;
        }
        fileObject = userFiles[i];
        let thisFile = {
          lastModified: fileObject.lastModified,
          lastModifiedDate: fileObject.lastModifiedDate,
          name: fileObject.name,
          size: fileObject.size,
          type: fileObject.type
        };
        let ksize = fileObject.size / 1000;
        if (ksize > Number(this.sizeLimit)) {
          this.internalError = "This file (" + ksize + " Kb) exceeds the size limit of " + this.sizeLimit + " Kb";
          return;
        }
        let allowed = false;
        if (this.mediaTypes.indexOf("image") > -1) {
          allowed = $self.isImage(fileObject);
        }
        if (this.mediaTypes.indexOf("video") > -1) {
          allowed = allowed || $self.isVideo(fileObject);
        }
        if (this.mediaTypes.indexOf("doc") > -1) {
          allowed = allowed || $self.ispdf(fileObject);
        }
        if (!allowed) {
          this.internalError = "Files of type " + fileObject.type + " are not allowed here.";
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          thisFile.dataUrl = e.target.result;
          arrayToLoad.push(thisFile);
          $self.$emit('updateMedia', {media: arrayToLoad});
          if ($self.isVideo(thisFile)) {
            // On selecting a video file
            //document.querySelector("#video-element source").setAttribute('src', URL.createObjectURL(document.querySelector("#file-input").thisFile));
          }
        };
        reader.readAsDataURL(fileObject);
      }
    }
  }
};
</script>
