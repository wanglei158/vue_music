# vue-music

> 音乐播放器
> 1、vuex vue-router（路由懒加载）
> 2、还存在一些问题没有解决，在 safari 浏览器上无法播放（有方法的请指教 1140153859@qq.com)

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).




<template>
    <div :class="[$style['titan-multibar'], 'titan-slide-fade', {[$style['titan-sidebar-active']] : sidebar}]" >
        <ul :class="$style['titan-mutitab-wrapper']">
            <li
                v-for="(tab, index) in tabList"
                :class="[{[$style['titan-mutitab-tab-item--selected']]: tab.key === currentTab.key}, $style['titan-mutitab-tab-item']]"
                :key="index"
                @click="switchTab(tab)"
            >
                {{ tab.name }}
                <i v-if="tabList.length > 1" :class="$style['titan-mutitab-tab-item__icon']" class="el-icon-close" @click.stop="CLOSETAB_REQUEST(tab)"/>
            </li>
        </ul>
        <!-- <hr :class="$style['titan-multibar__line']"> -->
    </div>
</template>
<script>
import {
    mapState,
    mapMutations
} from 'vuex';
import { debounce } from 'lodash';

export default {
    data() {
        return {
            max: 0,
            getNextDisable: false,
            getPreDisable: true
        }
    },
    computed: {
        ...mapState({
            userMenu: state => state.authInfo.userMenu,
            tabList: state => state.tabList,
            currentTab: state => state.currentTab,
            sidebar: state => state.sidebar
        })
    },
    watch: {
        $route(to) {
            let key = to.name;
            const begin = this.trampoline.bind(null, this.getOwnSelf);
            let breadcrumb = to.meta.breadcrumb;
            let length = breadcrumb ? breadcrumb.length-1 : '';
            this.SWITCHTAB_REQUEST({
                key: to.name,
                name: begin(this.userMenu, key) || breadcrumb[length].name,
                muti: true,
                params: to.params,
                query: to.query
            });
        },
        tabList(val) {
            this.computeScroll();
        }
    },
    methods: {
        ...mapMutations(['SWITCHTAB_REQUEST', 'CLOSETAB_REQUEST']),
        switchTab(tab) {
            const params = tab.params || {};
            this.SWITCHTAB_REQUEST({ ...tab, params });
        },
        getOwnSelf(arr, key, name = '') {
            let target;
            if(Array.isArray(arr) && arr.length > 0) {
                for(let i = 0, l = arr.length; i < l; i++) {
                    let item = arr[i];
                    if(JSON.stringify(item).includes(`"${key}"`)) {
                        target = item.items;
                        name = item.name;
                    }
                }
            } else {
                return name;
            }
            let _self = this;
            return function() {
                return _self.getOwnSelf(target, key, name);
            };
        },
        trampoline(func, ...rest) {
            const [arg, key] = rest;
            let value = func(arg, key);
            while (typeof value === 'function') {
                value = value();
            }
            return value;
        },
        horizontalMove(num) {
            clearTimeout(this.timer);
            const wrapperWidth = this.$refs.scrollWrapper.clientWidth;
            const targetDom = this.$refs.scrollBody;
            const currentPosition = targetDom.offsetLeft;
            if(num > 0 && currentPosition >=0) {
                return false;
            }
            if(num < 0 && currentPosition <= -this.max * wrapperWidth) {
                return false;
            }
            targetDom.style.left = currentPosition + num + 'px';
            this.timer = setTimeout(()=> {
                const ustand = this.$refs.scrollBody.offsetLeft;
                this.getPreDisable = ustand >=0;
                this.getNextDisable = ustand <= -this.max * wrapperWidth;
            }, 120);
        },
        getPre() {
            const wrapperWidth = this.$refs.scrollWrapper.clientWidth;
            const targetDom = this.$refs.scrollBody;
            let currentLeft = targetDom.offsetLeft;
            this.horizontalMovePos(wrapperWidth);
        },
        getNext() {
            const wrapperWidth = this.$refs.scrollWrapper.clientWidth;
            const targetDom = this.$refs.scrollBody;
            let currentLeft = targetDom.offsetLeft;
            this.horizontalMovePos(-wrapperWidth);
        },
        findActivePos() {
            const currItemIndex = this.tabList.findIndex(item => item.key === this.currentTab.key);
            const wrapperWidth = this.$refs.scrollWrapper.clientWidth;
            const currItemDom = this.$refs[`tabItem${currItemIndex}`][0];
            const floors = Math.floor(currItemDom.offsetLeft / wrapperWidth);
            this.horizontalMovePos(-wrapperWidth * floors);
        },
        computeScroll() {
            this.$nextTick(() => {
                const bodyWidth = this.$refs.scrollBody.clientWidth;
                const wrapperWidth = this.$refs.scrollWrapper.clientWidth;
                const floors = Math.floor(bodyWidth / wrapperWidth);
                this.max = floors;
                if(floors < 1) {
                    this.getNextDisable = true;
                    this.getPreDisable = true;
                }
                this.findActivePos();
            });
        }
    },
    created() {
        this.horizontalMovePos = debounce(this.horizontalMove, 120);
    },
    mounted() {
        this.computeScroll();
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style module>
@component-namespace titan {
    @b multibar {
        position: absolute;
        top: 56px;
        left: 220px;
        right: 0;
        bottom: 0;
        max-width: 100%;
        user-select: none;
        @e line {
            background-color: #DEEAF2;
            position: absolute;
            height: 1px;
            width: 100%;
            top: 39px;
        }
    }
    @b scroll-wrapper {
        width:100%;
        height:36px;
        position: relative;
        & > i{
            line-height: 32px;
            cursor: pointer;
            z-index: 12;
            top:0;
            width: 20px;
            position:absolute;
            color: #00C4C0;
        }
        @e pre {
            left: 0;
        }
        @e next {
            right: 18px;
        }
    }
    @b tank {
        width:96%;
        margin-left: 1%;
        overflow-x: hidden;
        position: relative;
        height:36px;
    }
    @b mutitab-wrapper {
        position: absolute;
        display: flex;
        top: 0px;
        left: 0px;
        /* width: 100%; */
        margin-bottom: -1px;
        z-index: 5;
        padding: 0 10px;
        transition: all 0.1s;
        border-bottom: 1px solid #ddd;
        box-shadow: 0 0px 0px rgba(0,0,0,.2);
    }
    @b mutitab-tab-item {
        position: relative;
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        padding: 0 25px;
        margin-left: 2px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        border: 1px solid #DEEAF2;
        border-bottom: 1px solid #fff;
        border-radius: 2px 2px 0px 0px;
        background-color: #fff;
        font-size: 12px;
        color: #333;
        transition: border-color .3s ease;
        @m selected {
            background-color: #fff;
            color: #00C4C0;
            border-top: 3px solid #00C4C0;
            line-height: 28px;
            border-bottom: 1px solid #FFF;
        }
        &:hover {
            i {
                transform: translate(0, -50%) matrix(1, 0, 0, 1, 0, 0);
                opacity: 1;
            }
        }
        @e icon {
            position: absolute;
            font-size: 12px;
            opacity: 0;
            transform: translate(100%, -50%) matrix(1, 0, 0, 1, 0, 0);
            vertical-align: middle;
            line-height: 15px;
            overflow: hidden;
            top: 50%;
            right: 5px;
            transform-origin: 100% 50%;
            transition: color .3s ease;
            border-radius: 50%;
            background-color: #fff;
            width: 15px;
            &:hover {
                background-color: #97a8be;
                color: #fff;
            }
        }
    }
    @b sidebar-active{
        left: 0;
    }
}
</style>
