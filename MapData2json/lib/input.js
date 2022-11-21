/** 標準入力で受け取った値を返す関数
 * @return {string} 標準入力で受け取った値
 */

module.exports = () => {
  const input = (length = 1) =>
    new Promise((resolve, reject) => {
      var lines = [];
      var reader = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      try {
        reader.on("line", function (line) {
          lines.push(line);
          if (lines.length === length) {
            reader.close();
            resolve(lines);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  return input;
};
