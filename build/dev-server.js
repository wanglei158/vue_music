var express = require('express');
const path = require('path');
const { spawn } = require('child_process');

var axios = require('axios');
// const IS_DEV = process.env.NODE_ENV === 'development';

var app = express();

var apiRoutes = express.Router();

apiRoutes.get('/qqmusic/getDiscList', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/qqmusic/getHotKey', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/qqmusic/search', function(req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp';
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/qqmusic/getTop', function(req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/qqmusic/getDisc', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/qqmusic/getLyric', function(req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      var ret = response.data;
      if (typeof ret === 'string') {
        var reg = /^\w+\(({[^()]+})\)$/;
        var matches = ret.match(reg);
        if (matches) {
          ret = JSON.parse(matches[1]);
        }
      }
      res.json(ret);
    })
    .catch(e => {
      console.log(e);
    });
});

apiRoutes.get('/lk', (req, res) => {
  res.json({ k: 12 });
});

// serve pure static assets
app.use('/static', express.static(path.join(__dirname, '../dist')));

app.use('/api', apiRoutes);

var server = app.listen(9000, () => {
  console.log(`后端已启动：9000`);
  // if(IS_DEV) {
  //   const clientServer = spawn('npm', ['run', 'dev']);
  //   clientServer.stdout.on('data', data => {
  //     console.log(`${data}`);
  //   });

  //   clientServer.on('close', code => {
  //     console.log(`子进程退出，使用退出码 ${code}`);
  //   });
  // }
});
