export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const mode = state => state.mode;

export const sequenceList = state => state.sequenceList;

export const currentIndex = state => state.currentIndex;

export const currentSong = state => {
  return state.playList[state.currentIndex] || {};
};

export const getHistory = state => state.searchHistory;

export const currentDisc = state => state.currentDisc;

export const playHistory = state => state.playHistory;

export const favoriteList = state => state.favoriteList;
