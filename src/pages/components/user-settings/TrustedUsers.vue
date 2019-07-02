<template>
<div>
  <div class="row">
    <div class="col-md-12">
      <h4 class="text-capitalize"><a @click.prevent="helpModal = !helpModal">Trusted users</a></h4>
    </div>
  </div>
  <help-topic-modal :modal="helpModal" :topic="'trusted-users'" @closeModal="helpModalClose"/>
  <p class="text-muted">Blockstack ids of friends</p>
  <textarea class="form-control" id="vc-tu" placeholder="blockstack friends" v-model="trusted" required></textarea>
  <a @click="checkForm($event)"><button class="btn btn-primary">save</button></a>
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
      checkForm: function() {
        let myProfile = this.$store.getters["myAccountStore/getMyProfile"];
        myProfile.auxiliaryProfile.trustedIds = this.trusted;
        this.$store.dispatch("myAccountStore/updateAuxiliaryProfile", myProfile.auxiliaryProfile)
          .then(auxiliaryProfile => {
            this.$notify({type: 'success', title: 'Friends List', text: 'Updated list of trusted blockstack users.'});
          })
          .catch(() => {
            this.$notify({type: 'success', title: 'Address Information', text: 'Error updating seller information.'});
          });
      },
      helpModalClose: function() {
        this.helpModal = false;
      },
    }
  };
</script>
