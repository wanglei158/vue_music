import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
export const playlistMixin = {
  computed: {
    ...mapGetters(["playList"])
  },

  activated() {
    this.handlePlaylist(this.playList);
  },
  watch: {
    playList(newV) {
      this.handlePlaylist(newV);
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error("component must implement handlePlayList method");
    }
  },
  mounted() {
    this.handlePlaylist(this.playList);
  }
};

export const playerMixin = {
  computed: {
    ...mapGetters([
      "fullScreen",
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteList"
    ]),
    playMode() {
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
          ? "icon-loop"
          : "icon-random";
    }
  },
  methods: {
    ...mapMutations({
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAY_LIST",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayState: "SET_PLAYING_STATE"
    }),
    ...mapActions(["saveFavoriteList", "deleteFavoriteList"]),
    changeMode() {
      // 改变播放模式
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this._resetCurrentIndex(list);
      this.setPlayList(list);
    },
    _resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    }
  }
};

export const searchMixin = {
  data() {
    return { query: "", refreshDelay: 120 };
  },
  computed: {
    ...mapGetters(["getHistory"])
  },
  methods: {
    ...mapActions(["saveSearchHistory", "deleteSearchHistory"]),
    blurInput() {
      this.$refs.searchbox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    onquery(keyWord) {
      this.query = keyWord;
    },
    selectQuey(word) {
      this.$refs.searchbox.setquery(word);
    }
  }
};
