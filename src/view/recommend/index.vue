<template>
    <div class="recommend" ref="contain">
        <scroll class="recommend-content" :data="discList" ref="scroll">
          <div>
            <div class="slider-wrapper" v-if="recommends.length">
              <slider>
                <div v-for="(item,i) in recommends" :key="i">
                  <a :href="item.linkUrl">
                    <img :src="item.picUrl" alt="" class="needsclick">
                  </a>
                </div>
              </slider>
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                  <li v-for="(item,i) in discList" :key="i" class="item" @click="selectItem(item)">
                    <div class="icon">
                      <img @load="loadImg"  v-lazy="item.imgurl" width="60" height="60" />
                    </div>
                    <div class="text">
                      <h2 class="name" v-html="item.creator.name"></h2>
                      <p class="desc" v-html="item.dissname"></p>
                    </div>
                  </li>
                </ul>
            </div>
          </div>
          <div class="loading-container" v-show="!discList.length">
            <loading />
          </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script>
import Slider from "@/base/slider";
import { getRecommend, getDiscList } from "@/api/recommend";
import { ERR_OK } from "@/api/config";
import Scroll from "@/base/scroll";
import { playlistMixin } from "common/js/mixin";
import Loading from "@/base/loading";
import { mapMutations } from "vuex";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  methods: {
    ...mapMutations({
      setDisc: "SET_DISC"
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length ? "60px" : "";
      this.$refs.contain.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    selectItem(it) {
      this.$router.push({ path: "/recommend/" + it.dissid });
      this.setDisc(it);
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slide-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        fonyt-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
      }
    }
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
