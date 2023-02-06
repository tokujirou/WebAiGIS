import { Button, TextField } from "@mui/material";
import axios from "axios";
import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Loading } from "../components/Loading";
import { useFile } from "../hooks/useFile";
import {
  UploadedModelJsonState,
  uploadedModelJsonState,
} from "../recoil/atoms";

export const Admin: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [objName, setObjName] = useState<string>("");
  const navigate = useNavigate();
  const [_, setUploadedModelJsonState] = useRecoilState(uploadedModelJsonState);

  const {
    file: mapdataFile,
    handleFile: handleMapdataFile,
    onClear: onMapdataClear,
  } = useFile();

  const {
    file: objFile,
    handleFile: handleObjFile,
    onClear: onObjClear,
  } = useFile();

  const onUploadFile = useCallback(async () => {
    const formData = new FormData();
    if (!mapdataFile) {
      console.error("invalid map file.");
      return;
    }
    if (!objFile) {
      console.error("invalid obj file.");
      return;
    }
    if (!objName) {
      console.error("invalid obj name.");
      return;
    }
    formData.append("mapdata_file", mapdataFile);
    formData.append("obj_name", objName);
    formData.append("obj_file", objFile);

    setIsLoading(true);
    // TODO: localhostではなくデプロイ先で動くようにする
    await axios
      .post("http://localhost:3000/upload-file", formData)
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      })
      .then((res) => {
        setIsLoading(false);
        setUploadedModelJsonState(
          res?.data as unknown as UploadedModelJsonState
        );
        navigate("../");
      });
  }, [mapdataFile, objFile, objName]);
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexFlow: "column",
        gap: "1rem",
        width: "60vw",
        margin: "0 auto",
        marginTop: "20vh",
        background: "white",
      }}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {mapdataFile ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ color: "black" }}>{mapdataFile.name}</p>
              <Button onClick={onMapdataClear} variant="outlined">
                CLEAR
              </Button>
            </div>
          ) : (
            <Button variant="contained" component="label">
              Upload Mapdata File
              <input
                type="file"
                id="mapdataUploader"
                accept=".txt"
                hidden
                onChange={handleMapdataFile}
              />
            </Button>
          )}
          <TextField
            placeholder="please type astroid name."
            value={objName}
            onChange={(e) => {
              setObjName(e.target.value);
            }}
          />
          {objFile ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ color: "black" }}>{objFile.name}</p>
              <Button onClick={onObjClear} variant="outlined">
                CLEAR
              </Button>
            </div>
          ) : (
            <Button variant="contained" component="label">
              Upload Obj File
              <input
                type="file"
                id="objUploader"
                accept=".obj"
                hidden
                onChange={handleObjFile}
              />
            </Button>
          )}
          {mapdataFile && objFile && (
            <Button variant="contained" onClick={onUploadFile}>
              UPLOAD
            </Button>
          )}
        </>
      )}
    </div>
  );
};
