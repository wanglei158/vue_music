import jsonp from 'common/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: 1534383838261
  });

  return jsonp(url, data, options);
}

export function getTop(topid) {
  const url = '/api/qqmusic/getTop';
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: topid,
    _: 1534388259105
  });
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
