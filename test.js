const http = require('http')
const { spawn } = require('child_process')
const createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: '123456' })


function run_cmd (cmd, args, callback) {
    const child = spawn(cmd, args);
    let resp = '';
    child.stdout.on('data', buffer => resp + buffer.toString());
    child.stdout.on('end', () => callback(resp));
}

http.createServer(function (req, res) {
    console.log(111);
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location22')
    })
  }).listen(3000)

  handler.on('issues', function (event) {
    console.log('Received an issue event for %s action=%s: #%d %s',
      event.payload.repository.name,
      event.payload.action,
      event.payload.issue.number,
      event.payload.issue.title)
  })

  handler.on('push', function (event) {
      console.log(event);
      /**
       * {
       *    event: 'push',
       *    id:'asdfdas',
       *    payload: {
       *        好多内容
       *    }
       * }
       */
    console.log('Received an push event for %s action=%s: #%d %s')
})
