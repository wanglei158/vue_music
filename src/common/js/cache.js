import storage from "good-storage";

const SEARCH_KEY = "__search__";
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = "__play__";
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = "__favorite_";
const FAVORITE_MAX_LENGTH = 200;

function insertArray(arr, val, compare, maxlen) {
  const index = arr.findIndex(compare);
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (maxlen && arr.length > maxlen) {
    arr.pop();
  }
}

export function saveSearch(query) {
  let searchs = storage.get(SEARCH_KEY, []);
  insertArray(
    searchs,
    query,
    item => {
      return item === query;
    },
    SEARCH_MAX_LENGTH
  );
  storage.set(SEARCH_KEY, searchs);
  return searchs;
}

export const loadSearch = function() {
  return storage.get(SEARCH_KEY, []);
};

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function deleteSearch(query) {
  let searchs = storage.get(SEARCH_KEY, []);
  deleteFromArray(searchs, item => {
    return item === query;
  });
  storage.set(SEARCH_KEY, searchs);
  return searchs;
}

export function clearSearchStorage() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  insertArray(
    songs,
    song,
    item => {
      return item.id === song.id;
    },
    PLAY_MAX_LENGTH
  );
  storage.set(PLAY_KEY, songs);
  return songs;
}

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  insertArray(
    songs,
    song,
    item => {
      return item.id === song.id;
    },
    FAVORITE_MAX_LENGTH
  );
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(songs, item => {
    return item.id === song.id;
  });
  storage.set(FAVORITE_KEY, songs);
  return songs;
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
