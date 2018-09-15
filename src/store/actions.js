import * as types from "./mutation-type";
import { playMode } from "common/js/config";
import { shuffle } from "common/js/util";
import {
  saveSearch,
  deleteSearch,
  clearSearchStorage,
  savePlay,
  saveFavorite,
  deleteFavorite
} from "../common/js/cache";

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function({ commit, state }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAY_LIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function({ commit, state }, song) {
  let playlist = state.playList.slice();
  let sequencelist = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查找当前列表中是否有待插入的歌曲并返回索引
  let findex = findIndex(playlist, song);
  // 因为是插入歌曲，所以是索引+1
  currentIndex++;
  // 插入这首歌到当前位置
  playlist.splice(currentIndex, 0, song);
  // 如果包含这首歌
  if (findex !== -1) {
    if (currentIndex > findex) {
      playlist.splice(findex, 1);
      currentIndex--;
    } else {
      playlist.splice(findex + 1, 1);
    }
  }

  let currentSIndex = findIndex(sequencelist, currentSong) + 1;
  let fsindex = findIndex(sequencelist, song);
  sequencelist.splice(currentSIndex, 0, song);
  if (fsindex !== -1) {
    if (currentSIndex > fsindex) {
      sequencelist.splice(fsindex, 1);
    } else {
      sequencelist.splice(fsindex + 1, 1);
    }
  }
  commit(types.SET_PLAY_LIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequencelist);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const saveSearchHistory = function({ commit, state }, query) {
  commit(types.SET_HISTORY, saveSearch(query));
};

export function deleteSearchHistory({ commit, state }, query) {
  commit(types.SET_HISTORY, deleteSearch(query));
}

export function clearSearch({ commit, state }) {
  commit(types.SET_HISTORY, clearSearchStorage());
}

export function deleteSong({ commit, state }, song) {
  let playlist = state.playList.slice();
  let sequencelist = state.sequenceList.slice();
  let currentIndex = state.currentIndex;
  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  let sIndex = findIndex(sequencelist, song);
  sequencelist.splice(sIndex, 1);
  if (currentIndex > pIndex || currentIndex === playlist.length - 1) {
    currentIndex--;
  }

  commit(types.SET_PLAY_LIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequencelist);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false);
  } else {
    commit(types.SET_PLAYING_STATE, true);
  }
}

export function deleteSongList({ commit, state }) {
  commit(types.SET_PLAY_LIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAY_MODE, false);
}

export function savePlayHistory({ commit, state }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
}

export function saveFavoriteList({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}

export function deleteFavoriteList({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}
