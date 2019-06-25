<template>
<mdb-container>
<mdb-container id="ContactSection" class="py-2 contact-section">
  <confirmation-modal class="text-dark" v-if="showModal" :modal="showModal" :title="modalTitle" :content="modalContent" @closeModal="closeModal"/>
    <section class="px-0">
      <mdb-row>
        <mdb-col col="12" lg="10">
          <h2 class="large-title mb-5">{{title}}</h2>
          <p v-html="featureMessage"></p>
        <mdb-row>
          <mdb-col md="5" class="">
            <div class="col-md-12">
              <router-link to="/" class="navbar-brand"><img :src="logo" alt="radicle logo" class="img-fluid"></router-link>
            </div>
            <div class="col-md-12">
              <h5 class="my-4"><strong>Contact Info</strong></h5>
              <p>The Fusebox, Brighton, BN1 4GH, UK</p>
              <p>Phone: +44 77 37 0848 12<br />
              Email: contact@dbid.io</p>
            </div>
          </mdb-col>
          <mdb-col md="7">
            <form class="contact-form needs-validation py-0 form-transparent" novalidate @submit.prevent="checkForm" id="contact-form">
              <mdb-row>
                <mdb-col md="12">
                  <mdb-input type="text" id="contact-name" label="Your name" v-model="name" required/>
                  </div>
                </mdb-col>
                <mdb-col md="12">
                  <mdb-input type="text" id="contact-email" label="Your email" v-model="email" required/>
                </mdb-col>
              </mdb-row>
              <mdb-row>
                <mdb-col md="12">
                  <mdb-input type="text" id="contact-subject" label="Subject" v-model="subject" required/>
                </mdb-col>
                <mdb-col col="12">
                  <div class="md-form">
                    <textarea class="form-control md-textarea" v-model="message" required></textarea>
                    <label for="contact-message" class="">Enter message</label>
                  </div>
                </mdb-col>
              </mdb-row>
              <div class="text-md-left mt-5 submit">
                <button class="submit bg-transparent h1-responsive">SEND</button>
            </div>
            </form>
          </mdb-col>
        </mdb-row>
        </mdb-col>
      </mdb-row>
    </section>
    </mdb-container>
    </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbBtn, mdbIcon, mdbInput, mdbTextarea, mdbCard, mdbCardBody } from 'mdbvue';
import ConfirmationModal from "@/views/components/utils/ConfirmationModal";
import axios from "axios";

export default {
  name: 'ContactSection',
  components: {
    ConfirmationModal,
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbIcon,
    mdbInput,
    mdbTextarea,
    mdbCard,
    mdbCardBody
  },
  props: ["featureMessage"],
  data() {
    return {
      title: "Contact Us",
      name: "",
      subject: "",
      email: "",
      message: "",
      description: "Please get in touch with any questions you have about the platform.",
      fields: [],
      buttonText: null,
      logo: require("@/assets/img/logo/logo-black-256x256.png"),
      showModal: false,
      modalTitle: "Sent Message",
      modalContent: "<p>Thanks for your interest - your message has been sent.</p>",
    };
  },
  created() {
  },
  methods: {
    upload() {
      let email = {
        text: this.message,
        subject: this.subject,
        originatorEmail: this.email,
        originatorName: this.name,
      };
      this.$store.dispatch("contentStore/sendContactEmail", email);
      this.showModal = true;
    },
    checkForm(event) {
      if (event) {
        event.preventDefault();
        event.target.classList.add('was-validated');
      }
      this.errors = [];
      if (!this.name) {
        this.errors.push("Please enter a name.");
      }
      if (!this.subject) {
        this.errors.push("Please enter a subject.");
      }
      if (!this.email) {
        this.errors.push("Please enter a email.");
      }
      if (!this.message) {
        this.errors.push("Please enter a message.");
      }
      if (this.errors.length > 0) {
        return false;
      } else {
        this.upload();
      }
    },
    closeModal: function() {
      this.showModal = false;
    }
  },
  computed: {
  }
};
</script>

<style>
.raised {
  border-radius: 10px;
  position: relative;
  top: 35px;
  margin: auto auto;
  margin-bottom: 50px;
}
.contact-form .md-form label,
.contact-form .md-form textarea ~ label.active {
  color: inherit!important;
  text-transform: uppercase;
  letter-spacing: 0.5px;

}
.submit {
  border: none;
}
.contact-form .form-control {
  color: inherit;
  font-weight: normal;
}

  .contact-form .submit {
    cursor: pointer;
  }
</style>
<style scoped>
.form-control {
  border: none;
}
  .md-form {
    margin-top: 0.7rem;
    margin-bottom: 0.7rem;
  }
.copyright {
  font-size: 0.7rem;
}
</style>
