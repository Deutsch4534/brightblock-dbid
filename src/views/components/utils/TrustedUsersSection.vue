<template>
<div>
  <div class="row">
    <div class="col-md-12">
      <mdb-popover trigger="click" :options="{placement: 'top'}">
        <div class="popover">
          <div class="popover-header">
            {{title}}
          </div>
          <div class="popover-body">
            {{description}}
          </div>
        </div>
        <a @click.prevent="" slot="reference">
          {{title}} <mdb-icon far icon="question-circle" />
        </a>
      </mdb-popover>
    </div>
    <div class="col-md-12 my-3">
      <textarea class="form-control" id="vc-tu" :placeholder="title" v-model="trusted" required></textarea>
    </div>
  </div>
  <div class="row mb-4">
    <div class="col-md-12">
      <a @click="checkForm($event)"><mdb-btn size="sm" type="submit" class="btn teal lighten-1">save</mdb-btn></a>
    </div>
  </div>
</div>
</template>

<script>
  import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';
  import { mdbPopover } from "mdbvue";

  export default {
    name: 'TrustedUsersSection',
    components: {
      mdbContainer,
      mdbPopover,
      mdbRow,
      mdbCol,
      mdbBtn,
      mdbIcon,
      mdbInput,
      mdbTextarea,
      mdbCard,
      mdbCardBody
    },
    props: {
      trustedIds: {}
    },
    data() {
      return {
        trusted: null,
        title: "Trusted users",
        description: "Trusted users will be able to decrypt your profile information - please enter as comma separated list of blockstack user ids.",
      };
    },
    mounted() {
      this.trusted = this.trustedIds;
    },
    methods: {
      checkForm(event) {
        this.$emit("saveTrustedUsers", this.trusted);
      }
    }
  };
</script>
