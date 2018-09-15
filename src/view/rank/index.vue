<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="topList" ref="toplist">
            <ul>
                <li class="item" v-for="(top,index) in topList" :key="index" @click="selectItem(top)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="top.picUrl" alt="">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song,jdx) in top.songList" :key="jdx">
                            <span>{{jdx+1}}</span>
                            <span>{{song.songname+' - '+song.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList">
                <loading />
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import { getTopList } from "@/api/rank";
import { ERR_OK } from "@/api/config";
import Scroll from "@/base/scroll";
import Loading from "@/base/loading";
import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: null
    };
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    selectItem(it) {
      this.$router.push({ path: `/rank/${it.id}` });
    },
    handlePlaylist(list) {
      const bottom = list.length ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    }
  },
  created() {
    this._getTopList();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
.rank
    position :fixed
    width:100%
    top:88px
    bottom :0
    .loading-container
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    .toplist
        height:100%
        overflow :hidden
        .item
            display :flex
            margin:0 20px
            padding-top :20px
            height:100px
            &:last-child
                padding-bottom :20px
            .icon
                flex:0 0 100px
                width:100px
                height 100px
            .songlist
                flex:1
                display :flex
                flex-direction :column
                justify-content:center
                padding:0 20px
                overflow:hidden
                height:100px
                span
                    font-size:$font-size-small
                    line-height :24px
                    color:$color-text-l
</style>
