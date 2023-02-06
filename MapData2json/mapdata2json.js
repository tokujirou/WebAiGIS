const createMapdata2Json = require("./lib/createMapdata2Json");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

function main() {
  const app = express();
  app.use(cors());

  const server = app.listen(3000, function () {
    console.log("Node.js is listening to PORT:" + server.address().port);
  });

  const cpUpload = upload.fields([
    { name: "mapdata_file", maxCount: 1 },
    { name: "obj_file", maxCount: 1 },
  ]);

  app.post("/upload-file", cpUpload, async (request, response) => {
    try {
      const data = await createMapdata2Json({
        mapdata_file_path: request?.files.mapdata_file[0]?.path,
        obj_file_path: request?.files.obj_file[0]?.path,
        asteroid_name: request?.body.obj_name,
      });
      response.json(data);
    } catch (err) {
      console.error(err);
      response.sendStatus(500);
    }
  });
}
main();
