<template>
    <div class="player" v-show="playList.length">
        <transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.img" width="100%" height="100%" alt="">
                </div>
                <div class="top">
                    <div class="back" @click="backMini">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle"
                @touchstart.prevent="middleTouchStart"
                @touchmove.prevent="middleTouchMove"
                @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="middlel">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" >
                                <img :src="currentSong.img" class="image" :class="playing?'play':'play pause'" alt="">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                          <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                class="text"
                                v-for="(line,i) in currentLyric.lines"
                                :key="i"
                                :class="{current:currentLineNum == i}"
                                >{{line.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <div class="dot" :class="{active:currentShow == 'cd'}"></div>
                        <div class="dot" :class="{active:currentShow == 'lyric'}"></div>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar :percent="percent" @percentChange="onPercentChange"></progress-bar>
                        </div>
                        <span class="time time-l">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="playMode" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left"  :class="disableCls">
                            <i class="icon-prev" @click="preSong" ></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i :class="playIcon" @click="togglePlay"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="icon-next" @click="nextSong"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="openNormal">
                <div class="icon">
                    <img :src="currentSong.img" width="40" :class="playing?'play':'play pause'" height="40" alt="">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progress-circle :radios="32" :percent="percent">
                        <i :class="playing?'icon-pause-mini':'icon-play-mini'" class="icon-mini" @click.stop="togglePlay"></i>
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlayList">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <play-list ref="playlist"></play-list>
        <audio ref="audio"
        @play="readyPlay"
        @error="errorPlay"
        @timeupdate="updateTime"
        @ended="end"
        :src="currentSong.url"
        ></audio>
    </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { preFixStyle } from "common/js/dom";
import ProgressBar from "@/base/progress-bar";
import ProgressCircle from "@/base/progress-circle";
import { playMode } from "common/js/config";
import PlayList from "@/components/playlist";
import Lyric from "lyric-parser";
import Scroll from "@/base/scroll";
import { playerMixin } from "@/common/js/mixin";
const transform = preFixStyle("transform");
const transitionDuration = preFixStyle("transitionDuration");

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: "",
      currentLyric: null,
      currentLineNum: 0,
      currentShow: "cd",
      playingLyric: ""
    };
  },
  computed: {
    playIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    }
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id || newSong.id === oldSong.id) {
        return;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        if (this.playing) {
          this.$refs.audio.play();
        }
        if (this.currentLyric) {
          this.currentLyric.stop();
        }
        this.getLyric();
      }, 1000);
    },
    playing(newState) {
      if (!this.songReady) {
        return;
      }
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newState ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    PlayList
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN"
    }),
    ...mapActions(["savePlayHistory"]),
    showPlayList() {
      this.$refs.playlist.show();
    },
    middleTouchStart(e) {
      if (this.currentShow === "cd") {
        this.touch.percent = 0;
      } else {
        this.touch.percent = 1;
      }
      this.inited = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },
    middleTouchMove(e) {
      if (!this.inited) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const delatY = touch.pageY - this.touch.startY;
      if (Math.abs(delatY) > Math.abs(deltaX)) {
        return;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(width / window.innerWidth);
      let domTarget = this.$refs.lyricList.$el;
      domTarget.style[transform] = `translate3d(${width}px,0,0)`;
      domTarget.style[transitionDuration] = 0;
      this.$refs.middlel.style.opacity = 1 - this.touch.percent;
      this.$refs.middlel.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      let offertWidth;
      let opacity;
      if (this.currentShow === "cd") {
        if (this.touch.percent > 0.1) {
          offertWidth = -window.innerWidth;
          this.currentShow = "lyric";
          opacity = 0;
        } else {
          offertWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offertWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offertWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      let domTarget = this.$refs.lyricList.$el;
      domTarget.style[transform] = `translate3d(${offertWidth}px,0,0)`;
      domTarget.style[transitionDuration] = "300ms";
      this.$refs.middlel.style.opacity = opacity;
      this.$refs.middlel.style[transitionDuration] = "300ms";
    },
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            return;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.playingLyric = "";
          this.currentTime = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        // this.$refs.lyricList.scrollTo(0, 1000);
      }
      this.playingLyric = txt;
    },
    onPercentChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
      if (!this.playing) {
        this.togglePlay();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    readyPlay() {
      if (this.playing) {
        this.$refs.audio.play();
      }
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
      window.removeEventListener("click", this.forceSafariPlayAudio, false);
    },
    errorPlay() {
      this.songReady = true;
    },
    format(interval) {
      interval = interval | 0;
      const min = (interval / 60) | 0;
      const sec = interval % 60;
      return `${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    preSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index === -1) {
          index = this.playList.length - 1;
        }

        this.setCurrentIndex(index);
      }
      this.songReady = false;
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
      }
      this.songReady = false;
    },
    togglePlay() {
      this.setPlayState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosSale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all .3s";
      const { x, y, scale } = this.getPosSale();
      /* eslint-disable */
      this.$refs.cdWrapper.style[
        transform
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      /* eslint-disable */
      this.$refs.cdWrapper.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    getPosSale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    backMini() {
      this.setFullScreen(false);
    },
    openNormal() {
      this.setFullScreen(true);
    },
    forceSafariPlayAudio() {
<<<<<<< HEAD
      this.$refs.audio.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
=======
      // this.$refs.audio.load(); // iOS 9   还需要额外的 load 一下, 否则直接 play 无效
>>>>>>> 6a6992e4386572b18060ec7b68cb368250f9857a
      this.$refs.audio.pause(); // iOS 7/8 仅需要 play 一下
    }
  },
  created() {
    this.touch = {};
  },
  mounted() {
    window.addEventListener("click", this.forceSafariPlayAudio, false);
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .player
        .normal-player
            position :fixed
            left:0
            top:0
            right:0
            bottom:0
            z-index: 200
            background: $color-background
            .background
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                z-index: -1
                opacity: 0.6
                filter: blur(20px)
            .top
                position: relative
                margin-bottom: 25px
                .back
                    position absolute
                    top: 0
                    left: 6px
                    z-index: 50
                    .icon-back
                        display: block
                        padding: 9px
                        font-size: $font-size-large-x
                        color: $color-text-ll
                        transform: rotate(-90deg)
                .title
                    width: 70%
                    margin: 0 auto
                    line-height: 40px
                    text-align: center
                    no-wrap()
                    font-size: $font-size-large
                    color: $color-text
                .subtitle
                    line-height: 20px
                    text-align: center
                    font-size: $font-size-medium
                    color: $color-text
            .middle
                position: fixed
                width: 100%
                top: 80px
                bottom: 170px
                white-space: nowrap
                font-size: 0
                .middle-l
                    display: inline-block
                    vertical-align: top
                    position: relative
                    width: 100%
                    height: 0
                    padding-top: 54%
                    .cd-wrapper
                        position: absolute
                        left: 23%
                        top: 0
                        width: 54%
                        height: 100%
                        .cd
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border: 10px solid rgba(255, 255, 255, 0.1)
                            border-radius: 50%
                            .image
                                position: absolute
                                left: 0
                                top: 0
                                width: 100%
                                height: 100%
                                border-radius: 50%
                                box-sizing: border-box;
                                border: 10px solid hsla(0,0%,100%,.1);
                            .play
                                animation: rotate 20s linear infinite
                            .pause
                                animation-play-state: paused
                    .playing-lyric-wrapper
                      width: 80%
                      margin: 30px auto 0 auto
                      overflow: hidden
                      text-align: center
                      .playing-lyric
                        height: 20px
                        line-height: 20px
                        font-size: $font-size-medium
                        color: $color-text-l
                .middle-r
                    display: inline-block
                    vertical-align: top
                    width: 100%
                    height: 100%
                    overflow: hidden
                    .lyric-wrapper
                        width: 80%
                        margin: 0 auto
                        overflow: hidden
                        text-align: center
                        .text
                            line-height: 32px
                            color: $color-text-l
                            font-size: $font-size-medium
                            &.current
                                color: $color-text
            .bottom
                position: absolute
                bottom: 50px
                width: 100%
                .dot-wrapper
                    text-align: center
                    font-size: 0
                    .dot
                        display: inline-block
                        vertical-align: middle
                        margin: 0 4px
                        width: 8px
                        height: 8px
                        border-radius: 50%
                        background: $color-text-l
                        &.active
                            width: 20px
                            border-radius: 5px
                            background: $color-text-ll
                .progress-wrapper
                    display: flex
                    align-items: center
                    width: 80%
                    margin: 0px auto
                    padding: 10px 0
                    .time
                        color: $color-text
                        font-size: $font-size-small
                        flex: 0 0 30px
                        line-height: 30px
                        width: 30px
                        &.time-l
                            text-align: left
                        &.time-r
                            text-align: right
                    .progress-bar-wrapper
                        flex: 1
                .operators
                    display: flex
                    align-items: center
                    .icon
                        flex: 1
                        color: $color-text-ll
                        &.disable
                            color: $color-theme-d
                        i
                            font-size: 30px
                    .i-left
                        text-align: right
                    .i-center
                        padding: 0 20px
                        text-align: center
                        i
                            font-size: 40px
                    .i-right
                        text-align: left
                    .icon-favorite
                        color: $color-sub-theme
            &.normal-enter-active, &.normal-leave-active
                transition: all 0.4s
                .top, .bottom
                    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
            &.normal-enter, &.normal-leave-to
                opacity: 0
                .top
                    transform: translate3d(0, -100px, 0)
                .bottom
                    transform: translate3d(0, 100px, 0)
        .mini-player
            display: flex
            align-items: center
            position: fixed
            left: 0
            bottom: 0
            z-index: 199
            width: 100%
            height: 60px
            background: $color-highlight-background
            &.mini-enter-active, &.mini-leave-active
                transition: all 0.4s
            &.mini-enter, &.mini-leave-to
                opacity: 0
            .icon
                flex: 0 0 40px
                width: 40px
                padding: 0 10px 0 20px
                img
                    border-radius: 50%
                    &.play
                        animation: rotate 10s linear infinite
                    &.pause
                        animation-play-state: paused
            .text
                display: flex
                flex-direction: column
                justify-content: center
                flex: 1
                line-height: 20px
                overflow: hidden
                .name
                    margin-bottom: 2px
                    no-wrap()
                    font-size: $font-size-medium
                    color: $color-text
                .desc
                    no-wrap()
                    font-size: $font-size-small
                    color: $color-text-d
            .control
                flex: 0 0 30px
                width: 30px
                padding: 0 10px
                .icon-play-mini, .icon-pause-mini, .icon-playlist
                    font-size: 30px
                    color: $color-theme-d
                .icon-mini
                    font-size: 32px
                    position: absolute
                    left: 0
                    top: 0
    @keyframes rotate {
      0% {
          transform: rotate(0);
      }
      100% {
          transform: rotate(360deg);
      }
    }
</style>
