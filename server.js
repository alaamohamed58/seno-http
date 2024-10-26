const fs = require("node:fs/promises");

const Seno = require("./seno/Seno");

const seno = new Seno();

seno.route("get", "/", (req, res) => {
  res.sendFile("./public/view.html", "text/html");
});

seno.route("get", "/style.css", (req, res) => {
  res.sendFile("./public/style.css", "text/css");
});

seno.route("get", "/app.js", (req, res) => {
  res.sendFile("./public/app.js", "text/javascript");
});

// seno.route("post", "/login", (req, res) => {
//   res.status(200).json({ message: "Login" });
// });

seno.route("post", "/upload", async (req, res) => {
  // let extension = "";
  // let isFirstChunk = true;
  // req.on("data", (chunk) => {
  //   if (isFirstChunk) {
  //     const magicBytes = chunk.subarray(0, 4).toString("hex");

  //     switch (magicBytes) {
  //       case "89504e47":
  //         extension = "png";
  //         break;
  //       case "ffd8ffe0":
  //         extension = "jpg";
  //         break;
  //       case "47494638":
  //         extension = "gif";
  //         break;
  //       case "504b0304":
  //         extension = "zip";
  //         break;
  //       default:
  //         console.error("Unknown file type.");
  //         return res.status(400).json({ error: "Unsupported file type" });
  //     }

  //     isFirstChunk = false;
  //   }
  // });

  const content_type = req.headers["content-type"];

  if (!content_type) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  const allowedMimeTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "application/zip",
  ];

  if (!allowedMimeTypes.includes(content_type)) {
    return res.status(400).json({ error: "Unsupported file type" });
  }

  const extension = content_type.split("/")[1];
  const name = new Date().toISOString() + 1;
  const fileHandle = await fs.open(`./storage/${name}.${extension}`, "w");
  const writeStream = fileHandle.createWriteStream();
  req.pipe(writeStream);
  req.on("end", async () => {
    try {
      fileHandle.close();
      writeStream.end();
      res.status(201).json({ message: "File uploaded successfully" });
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).json({ error: "File upload failed" });
    }
  });

  req.on("error", (err) => {
    console.error("Request error:", err);
  });

  writeStream.on("finish", () => {
    console.log("File successfully written!");
    fileHandle.close();
  });
});

seno.listen(4060, () => console.log("app running port 4060"));
