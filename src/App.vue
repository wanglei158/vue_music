<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Player from "@/components/player";
import MHeader from "./components/m-header";
import Tab from "components/tab";
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>
