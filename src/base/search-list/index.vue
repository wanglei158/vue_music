<template>
    <div class="search-list">
        <transition-group name="fade" tag="ul">
            <li class="search-item" v-for="(search) in searches" :key="search" @click="selectSearch(search)">
                <span class="text">{{search}}</span>
                <span class="icon" @click.stop="dele(search)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectSearch(sear) {
      this.$emit("selectItem", sear);
    },
    dele(sear) {
      this.$emit("deleteItem", sear);
    }
  }
};
</script>

<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    @import '~common/stylus/mixin';
    .search-list
        .search-item
            display :flex
            align-items :center
            height :40px
            &.fade-enter-active,&.fade-leave-active
                transition: all 0.1s linear
            &.fade-enter,&.fade-leave-to
                height:0
            .text
                flex:1
                color :$color-text-l
                font-size:$font-size-medium
            .icon
                extend-click()
                .icon-delete
                    font-size:$font-size-small
                    color:$color-text-d

</style>
