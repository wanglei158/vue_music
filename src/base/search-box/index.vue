<template>
    <div id="search-box">
        <i class="icon-search"></i>
        <input type="text" ref="query" class="box" v-model="query" :placeholder="placeholder">
        <i class="icon-dismiss" v-show="query" @click="clear"></i>
    </div>
</template>

<script>
import { debounce } from "@/common/js/util";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    setquery(keyword) {
      this.query = keyword;
    },
    blur() {
      this.$refs.query.blur();
    }
  },
  created() {
    this.$watch(
      "query",
      debounce(newV => {
        this.$emit("query", newV);
      }, 400)
    );
  }
};
</script>

<style lang="stylus" scoped>
    @import '~common/stylus/variable'
    #search-box
        display :flex
        align-items:center
        box-sizing :border-box
        width:100%
        padding 5px 10px
        height 40px
        background :$color-highlight-background
        .icon-search
            font size 24px
            color:$color-text-l
        .box
            flex:1
            margin:0 5px
            line-height 18px
            background:$color-highlight-background
            color:$color-text-ll
            font-size:$font-size-medium
            touch-action: none;
            border:0
            outline:none
            &::placeholder
                color:$color-text-l
        .icon-dismiss
            font-size :16px
            color:$color-text-l
</style>