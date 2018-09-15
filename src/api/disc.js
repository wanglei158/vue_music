import axios from "axios";
import { commonParams } from "./config";
export function getDisc(disId) {
  const url = "/api/qqmusic/getDisc";
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: disId,
    platform: "yqq",
    needNewCode: 0,
    hostUin: 0,
    format: "json"
  });
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
