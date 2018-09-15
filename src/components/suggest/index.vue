<template>
  <scroll
  id="suggest"
  :data="result"
  @scrollToEnd="loadMore"
  :pullup="true"
  ref="suggest"
  :beforeScroll="beforeScroll"
  @beforeScroll="listScroll"
  >
      <ul class="list">
          <li class="item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
              <div class="icon">
                  <i :class="getIconCls(item)"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getDsplayName(item)"></p>
              </div>
          </li>
          <loading v-show="!loadAll"></loading>
          <div class="no-result-wrapper">
            <no-result v-if="loadAll&&!result.length" title="暂无搜索结果" />
          </div>
      </ul>
  </scroll>
</template>

<script>
import { searchResult } from "@/api/search";
import { ERR_OK } from "@/api/config";
import { createSong } from "@/common/js/song";
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import Singer from "@/common/js/singer";
import { mapMutations, mapActions } from "vuex";
import NoResult from "@/base/no-result";
const TYPE_SINGER = "singer";
export default {
  props: {
    query: {
      type: String,
      default: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      loadAll: false,
      beforeScroll: true
    };
  },
  watch: {
    query(newV) {
      if (newV) {
        this.search(newV);
      }
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"]),
    listScroll() {
      this.$emit("listScroll");
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push("/search/" + singer.id);
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },
    loadMore() {
      if (this.loadAll) {
        return;
      }
      this.page++;
      searchResult(this.query, this.page, this.showSinger ? 1 : 0, 20).then(
        res => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._normalizeResult(res.data));
            this._checkMore(res.data);
          }
        }
      );
    },
    getDsplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name} - ${item.singer}`;
      }
    },
    search() {
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      searchResult(this.query, this.page, this.showSinger ? 1 : 0, 20).then(
        res => {
          if (res.code === ERR_OK) {
            this.result = this._normalizeResult(res.data);
            this._checkMore(res.data);
          }
        }
      );
    },
    _checkMore(data) {
      const songs = data.song;
      if (
        !songs.list.length ||
        songs.curnum + songs.curpage * 20 >= songs.totalnum
      ) {
        this.loadAll = true;
      } else {
        this.loadAll = false;
      }
    },
    _normalizeResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      let ret = [];
      list.map(musicData => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
    #suggest
        height 100%
        overflow :hidden
        .list
            padding:0 30px
            .item
                display:flex
                align-items:center
                padding-bottom :20px
            .icon
                flex:0 0 30px
                width:30px
                [class^="icon-"]
                    font-size:$font-size-medium
                    color:$color-text-d
            .name
                flex:1
                font-size:$font-size-medium
                color:$color-text-d
                .text
                    no-wrap()
        .no-result-wrapper
            position:absolute
            width:100%
            height:100%
            left:0
            top:50%
            z-index:-1
            transform:translateY(-50%)
</style>
