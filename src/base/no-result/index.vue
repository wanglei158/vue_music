<template>
    <div class="no-result">
        <div class="no-result-icon"></div>
        <p class="no-result-text">{{title}}</p>
    </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style   scoped lang="stylus" rel="stylesheet/stylus">
    @import '~common/stylus/variable'
    @import '~common/stylus/mixin'
    .no-result
        text-align :center
        .no-result-icon
            width:90px
            height :90px
            margin:0 auto
            bg-image('noresult')
            background-size:90px 90px
        .no-result-text
            margin-top:30px
            font-size:$font-size-medium
            color:$color-text-d
</style>
