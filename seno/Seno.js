const http = require("node:http");
const fs = require("node:fs/promises");

class Seno {
  constructor() {
    //private
    this.server = http.createServer();
    this.server.on("request", (req, res) => {
      res.sendFile = async (path, mime) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);
      };
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data) => {
        res.end(JSON.stringify(data));
        return res;
      };

      if (!this.routes[req.method.toLowerCase() + req.url])
        return res.status(404).json({ error: "unknown request" });

      this.routes[req.method.toLowerCase() + req.url](req, res);
    });
    /*

    {
        "get/upload": ()=>{},
        "post/upload": ()=>{},
    }


    this.routes["get/upload"]()

    */

    this.routes = {};
  }

  route(method, path, cb) {
    this.routes[method + path] = cb;
  }

  listen(port, cb) {
    this.server.listen(port, () => cb());
  }
}

module.exports = Seno;
