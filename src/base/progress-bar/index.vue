<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper"
            >
                <div class="progress-btn" ref="progressBtn"
                    @touchstart.prevent="progressSatrt"
                    @touchmove.prevent="progressMove"
                    @touchend="progressEnd"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import { preFixStyle } from "common/js/dom";
const transform = preFixStyle("transform");
export default {
  data() {
    return {
      touch: {}
    };
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent(newC) {
      if (newC > 0 && !this.touchInited) {
        const barWidth = this.$refs.progressBar.clientWidth - 6;
        const offsetWidth = newC * barWidth;
        this._offset(offsetWidth);
      }
    }
  },
  methods: {
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      this._triggerPercent();
    },
    progressSatrt(e) {
      this.touchInited = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressMove(e) {
      if (!this.touchInited) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - 6,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    },
    progressEnd() {
      this.touchInited = false;
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[transform] = `translateX(${offsetWidth}px)`;
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - 6;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    }
  }
};
</script>
<style rel="stylesheet/stylus" lang="stylus" scoped>
    @import '~common/stylus/variable'
    .progress-bar
        height:30px
        width:90%
        margin:0 auto
        .bar-inner
            position :relative
            top:14px
            height:1px
            background:rgba(255,255,255,.2)
            .progress
                position :absolute
                height 100%
                background:#fff
            .progress-btn-wrapper
                position :absolute
                left:0
                top:-13px
                .progress-btn
                    position :relative
                    top:10px
                    left 0
                    box-sizing :border-box
                    width:7px
                    height 7px
                    border-radius:50%
                    background:#fff
</style>
