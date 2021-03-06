<template>
    <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="onScroll"
    :probeType="3"
    >
      <ul>
          <li v-for="(group,i) in data" :key="i" class="list-group" ref="listgroup">
              <h2 class="list-group-title">{{group.title}}</h2>
              <ul>
                  <li v-for="(item,j) in group.items" :key="j" class="list-group-item" @click="selectItem(item)">
                      <img v-lazy="item.avatar" class="avatar" />
                      <span class="name">{{item.name}}</span>
                  </li>
              </ul>
          </li>
      </ul>
      <div class="list-shortcut">
        <ul
        @touchstart="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove"
        >
          <li
          v-for="(item,i) in shortcutList"
          :key="i"
          class="item"
          :data-index="i"
          :class="{'current':currentIndex===i}"
          >
            {{item}}
          </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixed">
        <h1 class="fixed-title">{{fixedTitle}}</h1>
      </div>
      <div class="loading-container" v-if="!data.length">
        <loading ></loading>
      </div>
    </scroll>
</template>

<script>
import Scroll from "@/base/scroll";
import { getData } from "common/js/dom";
import Loading from "@/base/loading";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: null
    };
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      if (newY >= 0) {
        this.currentIndex = 0;
        return;
      }
      //  在中间部分滚动
      const listHeight = this.listHeight;
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      //  滚动到底部 且-newY 大于最后一个元素的上限
      this.currentIndex = this.listHeight.length - 2;
    },
    diff(newV) {
      let fixedTop = newV > 0 && newV < TITLE_HEIGHT ? newV - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    onShortcutTouchStart(e) {
      let anchorIndex = parseInt(getData(e.target, "index"));
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this._scrollTo(anchorIndex);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    onScroll(pos) {
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      this.currentIndex = index;
      this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listgroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
.listview
  position: relative
  width: 100%
  height: 100%
  overflow: hidden
  background: $color-background
  .list-group
    padding-bottom: 30px
    .list-group-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
    .list-group-item
      display: flex
      align-items: center
      padding: 20px 0 0 30px
      .avatar
        width: 50px
        height: 50px
        border-radius: 50%
      .name
        margin-left: 20px
        color: $color-text-l
        font-size: $font-size-medium
  .list-shortcut
    position: absolute
    z-index: 30
    right: 0
    top: 50%
    transform: translateY(-50%)
    width: 20px
    padding: 20px 0
    border-radius: 10px
    text-align: center
    background: $color-background-d
    font-family: Helvetica
    .item
      padding: 3px
      line-height: 1
      color: $color-text-l
      font-size: $font-size-small
      &.current
        color: $color-theme
  .list-fixed
    position: absolute
    top: 0
    left: 0
    width: 100%
    .fixed-title
      height: 30px
      line-height: 30px
      padding-left: 20px
      font-size: $font-size-small
      color: $color-text-l
      background: $color-highlight-background
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
