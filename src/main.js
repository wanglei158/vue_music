import Vue from "vue";
import App from "./App";
import router from "./router";
import VueLazyLoad from "vue-lazyload";
import store from "@/store";

import fastclick from "fastclick";

import "common/stylus/index.styl";
/* eslint-disable */
import vConsole1 from "vconsole";
var vConsole = new vConsole1();
/* eslint-disable */

console.log("test");

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: require("common/image/logok.jpg")
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
