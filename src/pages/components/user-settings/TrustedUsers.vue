<template>
<div>
  <help-topic-modal :modal="helpModal" :topic="'trusted-users'" @closeModal="helpModalClose"/>
  <h4 class="text-capitalize"><a @click.prevent="helpModal = !helpModal">Trusted users</a></h4>
  <p class="text-muted">Blockstack ids of friends</p>
  <div class="row">
    <div class="col-md-12 my-3">
      <textarea class="form-control" id="vc-tu" placeholder="blockstack friends" v-model="trusted" required></textarea>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-12">
      <a @click="checkForm($event)"><button class="btn btn-light lighten-1">save</button></a>
    </div>
  </div>
</div>
</template>

<script>
  import HelpTopicModal from "../utils/HelpTopicModal";

  export default {
    name: 'TrustedUsers',
    components: {
      HelpTopicModal,
    },
    props: {
      trustedIds: {}
    },
    data() {
      return {
        trusted: null,
        helpModal: false,
      };
    },
    mounted() {
      this.trusted = this.trustedIds;
    },
    methods: {
      checkForm(event) {
        this.$emit("saveTrustedUsers", this.trusted);
      },
      helpModalClose: function() {
        this.helpModal = false;
      },
    }
  };
</script>
