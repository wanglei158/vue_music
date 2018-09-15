<template>
    <transition name="slide">
        <music-list :title="title" :bgImage="bgImg" :songs="songs"></music-list>
    </transition>
</template>
<script>
import MusicList from "@/components/music-list";
import { mapGetters } from "vuex";
import { getDisc } from "@/api/disc";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
export default {
  data() {
    return {
      detail: null
    };
  },
  computed: {
    ...mapGetters(["currentDisc"]),
    title() {
      if (this.detail) {
        return this.detail.dissname;
      } else {
        return "";
      }
    },
    bgImg() {
      if (this.detail) {
        return this.detail.logo;
      } else {
        return "";
      }
    },
    songs() {
      if (this.detail) {
        return this._normalizeSongs(this.detail.songlist);
      } else {
        return [];
      }
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getDisc() {
      getDisc(this.$route.params.id).then(res => {
        if (res.code === ERR_OK) {
          this.detail = res.cdlist[0];
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData, index) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  created() {
    this._getDisc();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .slide-enter-active,.slide-leave-active
        transition :all 0.3s
    .slide-enter,.slide-leave-to
        transform:translate3d(100%,0,0);
</style>
