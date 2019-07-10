<template>
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bgImage="avatar"></music-list>
  </transition>
</template>

<script>
import { getSingerDetail } from "@/api/singer";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
import { getSongKey } from "@/api/song";
import MusicList from "@/components/music-list";
import Singer from "common/js/singer";
export default {
  data() {
    return {
      songs: [],
      singer: null
    };
  },
  computed: {
    title() {
      if (this.singer) {
        return this.singer.name;
      }
      return "";
    },
    avatar() {
      if (this.singer) {
        return this.singer.avatar;
      }
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getSingerDetail() {
      getSingerDetail(this.$route.params.id).then(res => {
        if (res.code === ERR_OK) {
          this.singer = new Singer({
            id: res.data.singer_mid,
            name: res.data.singer_name
          });
          this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      const actualList = list.filter(
        item => item.musicData.songid && item.musicData.albummid
      );
      actualList.forEach(async item => {
        let { musicData } = item;
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
    this._getSingerDetail();
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
