<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <div class="icon-close"></div>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searchbox" placeholder="搜索歌曲" @query="onquery" />
            </div>
            <div class="shortcut" v-show="!query">
                <switches :currentIndex="currentIndex" @switchClick="switchItem" :switches="switc1h" />
                <div class="list-wrapper" ref="listWrapper">
                    <scroll class="list-scroll" ref="listScroll" v-if="currentIndex===0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @selectSong="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll v-if="currentIndex===1" class="list-scroll" :refreshDelay="refreshDelay">
                        <div class="list-inner">
                            <search-list :searches="getHistory" @deleteItem="deleteSearchHistory" @selectItem="selectQuey"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" :showSinger="false" @select="selectSuggest" @listScroll="blurInput" />
            </div>
            <top-tip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">1首歌曲已经添加到播放对列</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>

<script>
import Suggest from "@/components/suggest";
import { mapGetters, mapActions } from "vuex";
import SearchBox from "@/base/search-box";
import { searchMixin } from "@/common/js/mixin";
import Switches from "@/base/switches";
import Scroll from "@/base/scroll";
import SongList from "@/base/song-list";
import Song from "@/common/js/song";
import SearchList from "@/base/search-list";
import TopTip from "@/base/top-tip";
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      currentIndex: 0,
      switc1h: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["playHistory"])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  methods: {
    ...mapActions(["insertSong"]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listScroll.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip() {
      this.$refs.topTip.show();
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .add-song
        position :fixed
        top:0
        left:0
        bottom:0
        right:0
        z-index:200
        background:$color-background
        &.slide-enter-active,&.slide-leave-active
            transition :.3s all
        &.slide-enter,&.slide-leave-to
            transform :translateX(100%)
        .header
            position :relative
            height:44px
            text-align:center
            .title
                line-height 44px
                font-size:$font-size-large
                color:$color-text
            .close
                position: absolute
                top: 0
                right: 8px
                .icon-close
                    display: block
                    padding: 12px
                    font-size: 20px
                    color: $color-theme
        .search-box-wrapper
            margin: 20px
        .shortcut
            .list-wrapper
                position: absolute
                top: 165px
                bottom: 0
                width: 100%
                .list-scroll
                    height: 100%
                    overflow: hidden
                    .list-inner
                        padding: 20px 30px
        .search-result
            position: fixed
            top: 124px
            bottom: 0
            width: 100%
        .tip-title
            text-align: center
            padding: 18px 0
            font-size: 0
            .icon-ok
                font-size: $font-size-medium
                color: $color-theme
                margin-right: 4px
            .text
                font-size: $font-size-medium
                color: $color-text
</style>
