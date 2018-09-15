<template>
    <div id="search">
        <div class="search-box-wrapper">
            <search-box ref="searchbox" @query="onquery"></search-box>
        </div>
        <div class="shortcut-wrapper" ref="shortWrapper" v-show="!query">
          <scroll class="shortcut" :refreshDelay="refreshDelay" :data="shortcuts" ref="shortcutss">
              <div>
                  <div class="hot-key">
                      <h1 class="title">热门搜索</h1>
                      <ul>
                          <li class="item" v-for="(key,index) in hotKey" :key="index" @click="selectQuey(key.k)">
                              <span>{{key.k}}</span>
                          </li>
                      </ul>
                  </div>
                  <div class="search-history" v-show="getHistory.length">
                      <h1 class="title">
                          <span class="text">搜索历史</span>
                          <span class="clear" @click="showConfirm">
                              <i class="icon-clear"></i>
                          </span>
                      </h1>
                      <search-list @selectItem="selectQuey" @deleteItem="deleteSearchHistory" :searches="getHistory"></search-list>
                  </div>
              </div>
          </scroll>
        </div>
        <div class="search-result" v-show="query" ref="search_results">
            <suggest :query="query" @select="saveSearch" @listScroll="blurInput" ref="resultl"></suggest>
        </div>
        <confirm @confirm="clearSearch" text="是否清空搜索历史" ref="confirm" confirmBtnText="清空"  />
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from "@/base/search-box";
import { getHotKey } from "@/api/search";
import { ERR_OK } from "@/api/config";
import Suggest from "@/components/suggest";
import { playlistMixin, searchMixin } from "@/common/js/mixin";
import { mapActions } from "vuex";
import SearchList from "@/base/search-list";
import Confirm from "@/base/confirm";
import Scroll from "@/base/scroll";
export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: []
    };
  },
  computed: {
    shortcuts() {
      return this.hotKey.concat(this.getHistory);
    }
  },
  watch: {
    query(newV) {
      if (!newV) {
        setTimeout(() => {
          this.$refs.shortcutss.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  methods: {
    ...mapActions(["clearSearch"]),
    showConfirm() {
      this.$refs.confirm.show();
    },
    handlePlaylist(songs) {
      let bottom = songs.length ? "60px" : 0;
      this.$refs.search_results.style.bottom = bottom;
      this.$refs.shortWrapper.style.bottom = bottom;
      this.$refs.resultl.refresh();
      this.$refs.shortcutss.refresh();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    }
  },
  created() {
    this._getHotKey();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
#search
    .search-box-wrapper
        margin:0 20px
        margin-top:6px
    .shortcut-wrapper
        position :fixed
        top:178px
        bottom :0
        width:100%
        .shortcut
            height 100%
            overflow :hidden
            .hot-key
                margin:0 20px 20px 20px
                .title
                    margin-bottom :20px
                    font-size:$font-size-medium
                    color:$color-text-l
                .item
                    display :inline-block
                    padding:5px 10px
                    margin:0 20px 10px 0
                    border-radius 6px
                    background:$color-highlight-background
                    font-size:$font-size-medium
                    color:$color-text-l
            .search-history
                position :relative
                margin:0 20px
                .title
                    display:flex
                    align-items:center
                    height:40px
                    font-size:$font-size-medium
                    color:$color-text-d
                    .text
                        flex:1
                    .clear
                        extend-click()
                        .icon-clear
                            font-size:$font-size-medium
                            color:$color-text-d
    .search-result
        position :fixed
        width:100%
        top:156px
        bottom:0
</style>
