import { commonParams } from './config';
import jsonp from 'common/js/jsonp';
import axios from 'axios';
// import axios from "axios";
export function getLyric(sid) {
  const url = '/api/qqmusic/getLyric';
  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    musicid: sid,
    g_tk: 1066044874,
    platform: 'yqq',
    needNewCode: 0,
    hostUin: 0,
    format: 'json'
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function getSongKey(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const data = Object.assign(
    {},
    {
      callback: 'musicJsonCallback',
      loginUin: 3051522991,
      format: 'jsonp',
      platform: 'yqq',
      needNewCode: 0,
      cid: 205361747,
      uin: 3051522991,
      guid: 5931742855,
      songmid: songmid,
      filename: `C400${songmid}.m4a`
    }
  );

  return jsonp(url, data);
}
