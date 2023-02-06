import { Button, Dialog } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { Camera } from "three";
import { useOpen } from "../hooks/useOpen";
import { ColorMap } from "../types/loader";

export const UrlGenerateButton: FC<{
  camera: Camera | null;
  selectedMapData: number | null;
  selectedDataOption: { value: string; label: string };
  colorMap: ColorMap;
}> = ({ camera, selectedMapData, selectedDataOption, colorMap }) => {
  const [url, setUrl] = useState("");
  const { isOpen, onOpen, onClose } = useOpen();

  useEffect(() => {
    setUrl(
      `https://web-ai-gis.vercel.app/?selectedDataOption=${selectedDataOption.value}&x=${camera?.position.x}&y=${camera?.position.y}&z=${camera?.position.z}&selectedMapData=${selectedMapData}&colorMap=${colorMap}`
    );
  }, [
    selectedDataOption,
    camera?.position.x,
    camera?.position.y,
    camera?.position.z,
    selectedMapData,
    colorMap,
  ]);

  return (
    <>
      <Button
        onClick={onOpen}
        variant="outlined"
        style={{
          color: "white",
          borderColor: "white",
        }}
      >
        SHARE
      </Button>

      {isOpen && (
        <Dialog open onClose={onClose}>
          <div style={{ padding: "3rem", wordWrap: "break-word" }}>{url}</div>
          <Button
            onClick={() => {
              navigator.clipboard
                .writeText(url)
                .then(() => {
                  window.alert("Copied to clipboard!");
                  onClose();
                })
                .catch(() => console.error("Failed to copy to clipboard"));
            }}
          >
            Copy
          </Button>
        </Dialog>
      )}
    </>
  );
};
