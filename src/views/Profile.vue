<template>
  <mdb-container>
    <section class="text-center my-5">
      <h2 class="h1-responsive font-weight-bold my-5">Testimonials v.2</h2>
      <mdb-carousel testimonial fade :interval="5000" showControls>
        <mdb-carousel-item>
          <mdb-testimonial>
            <mdb-avatar class="mx-auto mb-4">
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg" class="rounded-circle img-fluid" alt="First sample avatar image"/>
            </mdb-avatar>
            <p>
              <mdb-icon icon="quote-left"></mdb-icon> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod eos id officiis hic tenetur quae quaerat ad velit ab. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore cum accusamus eveniet molestias voluptatum inventore laboriosam labore sit, aspernatur praesentium iste impedit quidem dolor veniam.
            </p>
            <h4 class="font-weight-bold">Anna Deynah</h4>
            <h6 class="font-weight-bold my-3">Founder at ET Company</h6>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star-half-alt" class="blue-text"> </mdb-icon>
          </mdb-testimonial>
        </mdb-carousel-item>
        <mdb-carousel-item>
          <mdb-testimonial>
            <mdb-avatar class="mx-auto mb-4">
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(31).jpg" class="rounded-circle img-fluid" alt="Second sample avatar image"/>
            </mdb-avatar>
            <p>
              <mdb-icon icon="quote-left"></mdb-icon> Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.
            </p>
            <h4 class="font-weight-bold">Maria Kate</h4>
            <h6 class="font-weight-bold my-3">Photographer at Studio LA</h6>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
          </mdb-testimonial>
        </mdb-carousel-item>
        <mdb-carousel-item>
          <mdb-testimonial>
            <mdb-avatar class="mx-auto mb-4">
              <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" class="rounded-circle img-fluid" alt="Third sample avatar image"/>
            </mdb-avatar>
            <p>
              <mdb-icon icon="quote-left"></mdb-icon> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
            </p>
            <h4 class="font-weight-bold">John Doe</h4>
            <h6 class="font-weight-bold my-3">Front-end Developer in NY</h6>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon icon="star" class="blue-text"> </mdb-icon>
            <mdb-icon far icon="star" class="blue-text"> </mdb-icon>
          </mdb-testimonial>
        </mdb-carousel-item>
      </mdb-carousel>
    </section>
  </mdb-container>
</template>

<script>
import { mdbContainer, mdbRow, mdbCol, mdbCard, mdbCardBody, mdbCardUp, mdbAvatar, mdbIcon, mdbCarousel, mdbCarouselItem, mdbTestimonial } from 'mdbvue';

export default {
  name: 'TestimonialsPage',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbCard,
    mdbCardBody,
    mdbCardUp,
    mdbAvatar,
    mdbIcon,
    mdbCarousel,
    mdbCarouselItem,
    mdbTestimonial
  },
  components: {},
  bodyClass: "profile-page",
  data() {
    return {
      profile: null
    };
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/missing/artwork-missing.jpg")
    },
    img: {
      type: String,
      default: require("@/assets/img/faces/avatar.jpg")
    }
  },
  mounted() {
    let profileId = Number(this.$route.params.profileId);
    this.profile = this.$store.getters["userProfilesStore/getTeamProfile"](
      profileId
    );
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
</style>
