import axios from "axios";
import { commonParams } from "./config";
export function getHotKey() {
  const url = "/api/qqmusic/getHotKey";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1,
    _: 1534402053481
  });
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function searchResult(keyword, page, catZhida, perpage) {
  const url = "/api/qqmusic/search";
  const data = Object.assign({}, commonParams, {
    platform: "h5",
    needNewCode: 1,
    w: keyword,
    zhidaqu: 1,
    catZhida: catZhida,
    t: 0,
    flag: 1,
    le: "utf-8",
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    p: page,
    remoteplace: "txt.mqq.all",
    _: 1534408689403,
    format: "json"
  });
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
