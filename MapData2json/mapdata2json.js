const fs = require("fs");
const fsPromises = require("fs/promises");
const { execSync } = require("child_process");
const input = require("./lib/input")();

async function main() {
  let vertex = [];
  let polygon = [];
  let count = 0;

  console.log("Please input '.obj filename' \n(ex)xxx.obj =>　\n");
  //const [inFileOBJ] = await input();
  const inFileOBJ = "test.obj";

  console.log("Please input '.json filename' \n(ex)xxx.json　=> \n");
  //const [outFile] = await input();
  const outFile = "test.json";

  execSync("cat " + inFileOBJ + " | sed -e 's/  */ /g' > Asteroid.txt");

  const dataFile = "Asteroid.txt";

  let asteroidData = fs.readFileSync(dataFile, "utf-8").split("\n");
  execSync("rm Asteroid.txt");

  for (let i in asteroidData) {
    if (asteroidData[i][0] == "v") {
      vertex.push(asteroidData[i].split(" "));
    }
    if (asteroidData[i][0] == "f") {
      polygon.push(asteroidData[i].split(" "));
      count += 1;
    }
  }

  fs.writeFile(
    outFile,
    '{\n\t"metadata": {\n\t\t"version": 4,\n\t\t"type": "BufferGeometry"\n\t},\n\t"data":{\n\t\t"attributes": {\n\t\t\t"position": {\n\t\t\t\t"itemSize": 3,\n\t\t\t\t"type": "Float32Array",\n\t\t\t\t"array": [',
    (err) => {
      if (err) throw err;
    }
  );

  for (let i = 0; i < count; i++) {
    for (let j = 1; j < 4; j++) {
      await fsPromises.appendFile(
        outFile,
        i === count - 1 && j === 3
          ? `${vertex[Number(polygon[i][j]) - 1][1]},${
              vertex[Number(polygon[i][j]) - 1][2]
            },${vertex[Number(polygon[i][j]) - 1][3]}`
          : `${vertex[Number(polygon[i][j]) - 1][1]},${
              vertex[Number(polygon[i][j]) - 1][2]
            },${vertex[Number(polygon[i][j]) - 1][3]},`,
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
  await fsPromises.appendFile(
    outFile,
    ']\n\t\t},\n\t\t"pressure": {\n\t\t\t"itemSize": 3,\n\t\t\t"type": "Float32Array",\n\t\t\t"array": [',
    (err) => {
      if (err) throw err;
    }
  );

  console.log(`And, input mapData '.txt filename' \n(ex)xxx.txt => `);
  //const [mapDataFileName] = await input();
  const mapDataFileName = "Geopotential_Height.txt";

  const mapData = await fsPromises.readFile(mapDataFileName, {
    encoding: "utf-8",
  });

  const mapDataLines = mapData.split("\n");
  const mapdataCount = mapDataLines[3];

  for (let i = 4; i < mapdataCount; i++) {
    const [a, b] = mapDataLines[i].trim().split(/\s+/);
    if (b === "-") {
      b = "0";
    }
    if (i === Number(mapdataCount) - 1) {
      await fsPromises.appendFile(outFile, `${b},${b},${b}`, (err) => {
        throw err;
      });
    } else {
      await fsPromises.appendFile(outFile, `${b},${b},${b},`, (err) => {
        throw err;
      });
    }
  }

  await fsPromises.appendFile(outFile, "]\n\t\t\t}\n\t\t}\n\t}\n}", (err) => {
    if (err) throw err;
  });
}

main();
