const fs = require("fs");
const fsPromises = require("fs/promises");
const { execSync } = require("child_process");

module.exports = async function createMapdata2Json({
  mapdata_file_path,
  obj_file_path,
  asteroid_name,
}) {
  let vertex = [];
  let polygon = [];
  let count = 0;

  const objFilePath = obj_file_path;
  const asteroidName = asteroid_name;
  const mapdataFilePath = mapdata_file_path;

  const mapData = await fsPromises.readFile(`${mapdataFilePath}`, {
    encoding: "utf-8",
  });
  const mapDataLines = mapData.split("\n");

  execSync("cat ./" + objFilePath + " | sed -e 's/  */ /g' > Asteroid.txt");

  const dataFile = "Asteroid.txt";

  let asteroidData = fs.readFileSync(dataFile, "utf-8").split("\n");
  execSync("rm Asteroid.txt");
  execSync(`rm ${objFilePath}`);
  execSync(`rm ${mapdataFilePath}`);

  for (let i in asteroidData) {
    if (asteroidData[i][0] == "v") {
      vertex.push(asteroidData[i].split(" "));
    }
    if (asteroidData[i][0] == "f") {
      polygon.push(asteroidData[i].split(" "));
      count += 1;
    }
  }

  const objTemplate = {
    metadata: {
      version: 4,
      type: "BufferGeometry",
    },
    userData: {
      name: asteroidName,
      kind: mapDataLines[1],
      unit: mapDataLines[2],
    },
    data: {
      attributes: {
        position: {
          itemSize: 3,
          type: "Float32Array",
          array: [],
        },
        pressure: {
          itemSize: 3,
          type: "Float32Array",
          array: [],
        },
      },
    },
  };

  for (let i = 0; i < count; i++) {
    for (let j = 1; j < 4; j++) {
      objTemplate.data.attributes.position.array.push(
        vertex[Number(polygon[i][j]) - 1][1]
      );
      objTemplate.data.attributes.position.array.push(
        vertex[Number(polygon[i][j]) - 1][2]
      );
      objTemplate.data.attributes.position.array.push(
        vertex[Number(polygon[i][j]) - 1][3]
      );
    }
  }
  const mapdataCount = mapDataLines[3];

  for (let i = 4; i < mapdataCount; i++) {
    const [_, val] = mapDataLines[i].trim().split(/\s+/);
    if (val === "-") {
      val = 0;
    }
    for (let j = 0; j < 3; j++) {
      objTemplate.data.attributes.pressure.array.push(val);
    }
  }

  return JSON.stringify(objTemplate);
};
