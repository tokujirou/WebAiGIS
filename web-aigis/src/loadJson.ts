import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Material,
  MeshLambertMaterial,
} from "three";
import { Lut } from "three/examples/jsm/math/Lut";
import { ColorMap } from "./types/loader";

function loadJson(
  geometry: BufferGeometry,
  setGeometry: (geometry: BufferGeometry) => void,
  setMaterial: (material: Material) => void,
  colorMap: ColorMap = ColorMap.Rainbow
) {
  geometry.computeVertexNormals();
  geometry.normalizeNormals();

  //map dataの最初の値をmaxとminに格納してforループでmax値とmin値を探す
  const geometryAttributesPressureArray = Array.from(
    geometry?.attributes.pressure.array
  );
  const max = geometryAttributesPressureArray.reduce((a, b) => {
    return Math.max(a, b);
  });
  const min = geometryAttributesPressureArray.reduce((a, b) => {
    return Math.min(a, b);
  });

  let lutColors = [];
  const COLOR_KIND = 512;
  let color;

  //カラースケールの宣言
  let lut = new Lut(colorMap, COLOR_KIND);
  lut.setMax(max);
  lut.setMin(min);

  for (var i = 0; i < geometry.attributes.pressure.array.length; i++) {
    var colorValue = geometry.attributes.pressure.array[i];
    //map dataが0だったら白くする
    if (colorValue == 0) {
      color = new Color(1, 1, 1);
    } else {
      // 0じゃなかったら色を割り当てる
      color = lut.getColor(colorValue);
    }
    // ポリゴンの頂点それぞれにRGBの順に値を入れる
    lutColors.push(color.r);
    lutColors.push(color.g);
    lutColors.push(color.b);
  }

  // データにずれがあった場合、差分を調整する
  if (lutColors.length !== geometry.attributes.position.array.length) {
    const gap = Math.abs(
      lutColors.length - geometry.attributes.position.array.length
    );
    for (let i = 0; i < gap * 3; i++) {
      lutColors.push(0);
    }
  }
  geometry.setAttribute(
    "color",
    new BufferAttribute(new Float32Array(lutColors), 3)
  );
  geometry.computeBoundingBox();

  let material = new MeshLambertMaterial({
    side: DoubleSide,
    color: 0xf5f5f5,
    vertexColors: true,
  });

  setGeometry(geometry);
  setMaterial(material);
}

export default loadJson;
