<template>
    <div class="switches">
        <li class="switch-item" @click="switchItem(index)" v-for="(item,index) in switches" :key="index" :class="{'active':currentIndex===index}">{{item.name}}</li>
    </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    switchItem(index) {
      this.$emit("switchClick", index);
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  .switches
    display:flex
    width:240px
    align-items:center
    margin:0 auto
    border:1px solid $color-highlight-background
    border-radius:5px
    .switch-item
      flex:1
      padding:8px
      text-align:center
      font-size:$font-size-medium
      color:$color-text-d
      &.active
        background:$color-highlight-background
        color:$color-text
</style>
