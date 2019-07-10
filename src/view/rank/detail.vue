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
import { getSongKey } from "@/api/song";
export default {
  data() {
    return {
      flag: 0,
      detail: null,
      rank: true,
      songs: []
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
          this._normallizeSongs(this.detail.songlist);
        }
      });
    },
    _normallizeSongs(songs) {
      let ret = [];
      const actualList = songs.filter(
        item => item.data.songid && item.data.albummid
      );
      actualList.forEach(async item => {
        let { data: musicData } = item;
        const { data } = await getSongKey(musicData.songmid);
        const vkey = data.items[0].vkey;
        ret.push(createSong(musicData, vkey));
        if (ret.length === actualList.length) {
          this.songs = ret;
        }
      });
    }
  },
  created() {
    this._getTop();
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
