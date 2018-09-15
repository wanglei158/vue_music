<template>
    <div class="music-list">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImg">
          <div class="play-wrapper" v-show="songs.length" ref="playBtn">
            <div class="play" @click="randomPlaySong">
              <i class="icon-play"></i>
              <span class="text">随机播放全部</span>
            </div>
          </div>
          <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll
        :data="songs"
        class="list"
        ref="list"
        :probe-type="3"
        :listenScroll="true"
        @scroll="listenScrollY"
        >
          <div class="song-list-wrapper">
            <song-list :songs="songs" @selectSong="selectSong" :rank="rank"></song-list>
          </div>
          <div class="loading-container" v-show="!songs.length">
            <loading></loading>
          </div>
        </scroll>
    </div>
</template>

<script>
import SongList from "@/base/song-list";
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import { preFixStyle } from "common/js/dom";
import { mapActions } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
const REVER_HEIGHT = 40;
const transform = preFixStyle("transform");
const backdrop = preFixStyle("backdrop-filter");
export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY + REVER_HEIGHT, newY);
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      let targetDom = this.$refs.bgImg;
      if (newY < this.minTranslateY) {
        zIndex = 10;
        targetDom.style.paddingTop = 0;
        targetDom.style.height = `${REVER_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        targetDom.style.paddingTop = "70%";
        targetDom.style.height = 0;
        this.$refs.playBtn.style.display = "block";
      }
      const percent = Math.abs(newY / this.imgHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20 * percent, 20);
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      targetDom.style.zIndex = zIndex;
      targetDom.style[transform] = `scale(${scale})`;
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  methods: {
    ...mapActions(["selectPlay", "randomPlay"]),
    handlePlaylist(list) {
      const bottom = list.length ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    back() {
      this.$router.back();
    },
    listenScrollY(pos) {
      this.scrollY = pos.y;
    },
    randomPlaySong() {
      this.randomPlay({ list: this.songs });
    }
  },
  mounted() {
    this.imgHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imgHeight;
    this.$refs.list.$el.style.top = this.$refs.bgImg.clientHeight + "px";
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin'
  .music-list
    position :fixed
    z-index :100
    top:0
    left:0
    bottom :0
    right:0
    background:$color-background
    .back
      position :absolute
      top:0;
      left 6px
      z-index:50
      .icon-back
        display:block
        padding 10px
        font-size:$font-size-large-x
        color:$color-text-ll
    .title
      position absolute
      top:0
      left 10%
      z-index:40
      width:80%
      no-wrap()
      text-align :center
      line-height :40px
      font-size:$font-size-large
      color:$color-text
    .bg-image
      position :relative
      width:100%
      height:0
      padding-top:70%;
      transform-origin :top
      background-size:cover
      .play-wrapper
        position :absolute
        bottom: 20px
        z-index: 50
        width:100%
        .play
          box-sizing :border-box
          width:135px
          padding:7px 0
          margin:0 auto
          text-align :center
          border:1px solid $color-text-ll
          color:$color-text-ll
          border-radius: 100px
          font-size:0
          .icon-play
            display :inline-block
            vertical-align :middle
            margin-right:6px
            font-size:$font-size-medium-x
          .text
            display :inline-block
            vertical-align :middle
            font-size:$font-size-small
      .filter
        position :absolute
        top:0
        left:0
        width:100%
        height :100%
        background:rgba(7,17,27,0.4);
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
