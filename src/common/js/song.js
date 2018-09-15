import { getLyric } from "@/api/song";
import { ERR_OK } from "@/api/config";
import { unescapeHtml } from "./util";
export default class Song {
  constructor({ id, name, mid, singer, album, duration, img, url }) {
    this.id = id;
    this.name = name;
    this.mid = mid;
    this.singer = singer;
    this.album = album;
    this.duration = duration;
    this.img = img;
    this.url = url;
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then(res => {
        if (res.code === ERR_OK) {
          this.lyric = unescapeHtml(res.lyric);
          resolve(this.lyric);
        } else {
          resolve("no lyric");
        }
      });
    });
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    name: musicData.songname,
    mid: musicData.songmid,
    singer: getArtist(musicData.singer),
    album: musicData.albumname,
    duration: musicData.interval,
    img:
      "https://y.gtimg.cn/music/photo_new/T002R300x300M000" +
      musicData.albummid +
      ".jpg?max_age=2592000",
    url:
      "http://ws.stream.qqmusic.qq.com/C100" +
      musicData.songmid +
      ".m4a?fromtag=0&guid=126548448"
  });
}

function getArtist(list) {
  let ret = [];
  if (!list) {
    return "";
  }
  list.forEach((item, index) => {
    ret.push(item.name);
  });
  return ret.join("/");
}
