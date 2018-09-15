<template>
  <transition name="slider">
    <music-list :bgImage="bgimg" :title="title" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from "@/components/music-list";
import { getTop } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
export default {
  data() {
    return {
      flag: 0,
      detail: null,
      rank: true
    };
  },
  computed: {
    bgimg() {
      if (this.flag) {
        return this.detail.topinfo.pic_album;
      }
      return "";
    },
    title() {
      if (this.flag) {
        return this.detail.topinfo.ListName;
      }
      return "";
    },
    songs() {
      if (this.flag) {
        return this._normallizeSongs(this.detail.songlist);
      }
      return [];
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getTop() {
      getTop(this.$route.params.id).then(res => {
        if (res.code === ERR_OK) {
          this.flag = 1;
          this.detail = res;
        }
      });
    },
    _normallizeSongs(songs) {
      let ret = [];
      songs.map(item => {
        let { data } = item;
        if (data.songid && data.albummid) {
          ret.push(createSong(data));
        }
      });
      return ret;
    }
  },
  created() {
    this._getTop();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
  .slider-enter-active,.slider-leave-active
    transition :all 0.3s
  .slider-enter,.slider-leave-to
    transform :translate3d(100%,0,0)
</style>
