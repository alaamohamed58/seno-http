import http from "node:http";
import fs from "node:fs/promises";

export class Seno {
  server = http.createServer();
  routes: any = {};
  constructor() {
    //private
    //this.server = http.createServer();
    this.server.on("request", (req: Request, res: any) => {
      res.sendFile = async (path: string, mime: string) => {
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);
      };
      res.status = (code: number) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data: any) => {
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

    // this.routes = {};
  }

  route(method: string, path: string, cb: (req: Request, res: any) => void) {
    this.routes[method + path] = cb;
  }

  listen(port: number, cb: () => void) {
    this.server.listen(port, () => cb());
  }
}
