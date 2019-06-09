<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="row">
          <div class="col-md-6 md-small-size-70 md-xsmall-size-100">
            <h1 class="title">Your Story Starts With Us.</h1>
              <h4>Every landing page needs a small description after the big bold title, that's why we added this text here. Add here all the information that can make you or your product create the first impression.</h4>
              <br>
              <button href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" class="md-success md-lg" target="_blank" rel="noreferrer"><i class="fas fa-play"></i> Watch video</button>
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="row">
            <div class="col-md-8 mx-auto text-center">
              <h2 class="title text-center">Let's talk product</h2>
              <h5 class="description">This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn't scroll to get here. Add a button if you want the user to see more.</h5>
            </div>
          </div>
          <div class="features text-center">
            <div class="row">
              <div class="col-md-4">
                <div class="info">
                  <div class="icon icon-info">
                    <mdb-icon far icon="comment" />
                  </div>
                  <h4 class="info-title">Free Chat</h4>
                  <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>
                </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                    <div class="icon icon-success">
                      <mdb-icon icon="user-check" />
                    </div>
                    <h4 class="info-title">Verified Users</h4>
                    <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>
                  </div>
              </div>
              <div class="col-md-4">
                  <div class="info">
                    <div class="icon icon-danger">
                      <mdb-icon icon="fingerprint" />
                    </div>
                    <h4 class="info-title">Fingerprint</h4>
                    <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="section text-center">
        <div class="container">
          <h2 class="title">Here is our team</h2>
          <div class="team">
              <div class="row">
                  <div class="col-md-4">
                    <div class="team-player">
                      <md-card class="md-card-plain">
                        <div class="col-md-6 mx-auto">
                          <img :src="teamImg1" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid">
                        </div>
                        <h4 class="card-title">Gigi Hadid
                          <br>
                          <small class="card-description text-muted">Model</small>
                        </h4>

                        <md-card-content>
                          <p class="card-description">You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href="#">links</a> for people to be able to follow them outside the site.</p>
                        </md-card-content>

                        <md-card-actions class="text-center">
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-twitter"></i>
                          </button>
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-instagram"></i>
                          </button>
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-facebook-square"></i>
                          </button>
                        </md-card-actions>
                      </md-card>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="team-player">
                      <md-card class="md-card-plain">
                        <div class="col-md-6 mx-auto">
                          <img :src="teamImg2" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid">
                        </div>
                        <h4 class="card-title">Carla Hortensia
                          <br>
                          <small class="card-description text-muted">Designer</small>
                        </h4>

                        <md-card-content>
                          <p class="card-description">You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href="#">links</a> for people to be able to follow them outside the site.</p>
                        </md-card-content>

                        <md-card-actions class="text-center">
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-twitter"></i>
                          </button>
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-linkedin"></i>
                          </button>
                        </md-card-actions>
                      </md-card>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="team-player">
                      <md-card class="md-card-plain">
                        <div class="col-md-6 mx-auto">
                          <img :src="teamImg3" alt="Thumbnail Image" class="img-raised rounded-circle img-fluid">
                        </div>
                        <h4 class="card-title">Mum and Dad
                          <br>
                          <small class="card-description text-muted">Model</small>
                        </h4>

                        <md-card-content>
                          <p class="card-description">You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href="#">links</a> for people to be able to follow them outside the site.</p>
                        </md-card-content>

                        <md-card-actions class="text-center">
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-twitter"></i>
                          </button>
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-instagram"></i>
                          </button>
                          <button href="javascript:void(0)" class="md-just-icon md-simple">
                            <i class="fab fa-facebook-square"></i>
                          </button>
                        </md-card-actions>
                      </md-card>
                    </div>
                  </div>
              </div>
          </div>
        </div>
      </div>

      <div class="section section-contacts">
        <div class="container">
          <div class="row">
            <div class="col-md-8 mx-auto">
              <h2 class="text-center title">Work with us</h2>
              <h4 class="text-center description">Divide details about your product or agency work into parts. Write a few lines about each one and contact us about any further collaboration. We will responde get back to you in a couple of hours.</h4>
              <form class="contact-form">
                  <div class="row">
                      <div class="col-md-6">
                        <div>
                          <label>Your Name</label>
                          <input v-model="name" type="text"></input>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div>
                          <label>Your Email</label>
                          <input v-model="email" type="email"></input>
                        </div>
                      </div>
                  </div>
                  <div maxlength="5">
                    <label>Your Message</label>
                    <textarea v-model="message"></textarea>
                  </div>
                  <div class="row">
                    <div class="col-md-4 mx-auto text-center">
                      <button class="btn btn-success">Send Message</button>
                    </div>
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    },
    teamImg1: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    },
    teamImg2: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    },
    teamImg3: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    }
  },
  data() {
    return {
      name: null,
      email: null,
      message: null
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  }
};
</script>

<style scoped>
.md-card-actions.text-center {
  display: flex;
  justify-content: center !important;
}
.contact-form {
  margin-top: 30px;
}

.md-has-textarea + .row {
  margin-top: 15px;
}
</style>
