import Router from "vue-router";

import Index from "./pages/Index.vue";
import Sell from "./pages/Sell.vue";
import ItemDetails from "./pages/ItemDetails.vue";
import HelpTopics from "./pages/HelpTopics";
import Contact from "./pages/Contact.vue";
import UserSettings from "./pages/UserSettings.vue";
import Login from "./pages/Login.vue";

import Admin from "./pages/Admin.vue";
import AdminSettings from "./pages/components/admin/AdminSettings";
import AdminBitcoin from "./pages/components/admin/AdminBitcoin";
import AdminLightning from "./pages/components/admin/AdminLightning";
import AdminRegistrations from "./pages/components/admin/AdminRegistrations";
import AdminBuildIndex from "./pages/components/admin/AdminBuildIndex";
import AdminQueryIndex from "./pages/components/admin/AdminQueryIndex";

import Navbar from "./layout/Navbar.vue";
import Footer from "./layout/Footer.vue";

import myAccountService from "@/services/myAccountService";

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "/index",
      name: "index1",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/",
      name: "index",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/login",
      name: "login",
      components: { default: Login, header: Navbar, footer: Footer },
      props: {
        header: { colorOnScroll: 400 }
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/buy",
      name: "buy",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/sell",
      name: "sell",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/seller-info",
      name: "seller-info",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/user/settings",
      name: "user-settings",
      components: {
        default: UserSettings,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/items/:itemId",
      name: "item-details",
      components: {
        default: ItemDetails,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false },
    },
    {
      path: "/my-items",
      name: "my-items",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true },
    },
    {
      path: "/my-items/:itemId",
      name: "my-item",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true },
    },
    {
      path: "/my-items/update/:itemId",
      name: "my-item-update",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-item/register/:itemId",
      name: "my-item-register",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-item/set-price/:itemId",
      name: "my-item-set-price",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-item/coa/:itemId",
      name: "my-item-coa",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-item/upload",
      name: "my-item-upload",
      components: {
        default: Sell,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-orders",
      name: "my-orders",
      components: { default: Sell, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-unsold",
      name: "unsold",
      components: { default: Sell, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-selling",
      name: "selling",
      components: { default: Sell, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-buying",
      name: "buying",
      components: { default: Sell, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },
    {
      path: "/my-orders/:assetHash",
      name: "my-order",
      components: { default: Sell, header: Navbar, footer: Footer },
      meta: { requiresAuth: true }
    },

    {
      path: "/contact",
      name: "contact",
      components: {
        default: Contact,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/help/topics/:topicId",
      name: "help-topic",
      components: {
        default: HelpTopics,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false },
    },
    {
      path: "/help/topics",
      name: "help-topics",
      meta: { requiresAuth: false },
      components: { default: HelpTopics, header: Navbar, footer: Footer },
    },
    {
      path: "/home",
      name: "home",
      components: {
        default: Index,
        header: Navbar,
        footer: Footer
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/admin",
      name: "admin",
      meta: { requiresAuth: true },
      components: { default: Admin, header: Navbar, footer: Footer },
      children: [
        {
          path: "/admin/build-index",
          name: "adminBuildIndex",
          component: AdminBuildIndex
        },
        {
          path: "/admin/query-index",
          name: "adminQueryIndex",
          component: AdminQueryIndex
        },
        {
          path: "/admin/settings",
          name: "adminSettings",
          component: AdminSettings
        },
        {
          path: "/admin/bitcoin",
          name: "adminBitcoin",
          component: AdminBitcoin
        },
        {
          path: "/admin/lightning",
          name: "adminLightning",
          component: AdminLightning
        },
        {
          path: "/admin/registrations",
          name: "adminRegistrations",
          component: AdminRegistrations
        }
      ]
    },
  ],
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0};
  }
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (myAccountService.isLoggedIn() > -1) {
      return next();
    } else {
      return next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    return next(); // make sure to always call next()!
  }
});

export default router;
