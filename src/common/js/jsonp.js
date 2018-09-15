import originJSONP from "jsonp";
export default function jsonp(url, data, option) {
  url += (url.indexOf("?") !== -1 ? "&" : "?") + param(data);
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function param(data) {
  let url = "";
  for (var j in data) {
    let value = data[j] !== undefined ? data[j] : "";
    url += `&${j}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : "";
}
