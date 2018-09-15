import { commonParams } from "./config";
import axios from "axios";
// import axios from "axios";
export function getLyric(sid) {
  const url = "/api/qqmusic/getLyric";
  const data = Object.assign({}, commonParams, {
    nobase64: 1,
    musicid: sid,
    g_tk: 1066044874,
    platform: "yqq",
    needNewCode: 0,
    hostUin: 0,
    format: "json"
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
