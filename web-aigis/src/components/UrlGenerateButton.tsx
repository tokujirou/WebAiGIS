import { Button, Dialog } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Camera } from "three";
import { ColorMap } from "../types/loader";

export const UrlGenerateButton: FC<{
  camera: Camera | null;
  selectedMapData: number | null;
  selectedDataOption: { value: string; label: string };
  colorMap: ColorMap;
}> = ({ camera, selectedMapData, selectedDataOption, colorMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const showModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Button
        onClick={showModal}
        variant="outlined"
        style={{
          position: "absolute",
          right: 12,
          bottom: 12,
          color: "white",
          borderColor: "white",
        }}
      >
        Generate URL
      </Button>

      {isOpen && (
        <Dialog open onClose={closeModal}>
          <div style={{ padding: "3rem", wordWrap: "break-word" }}>
            {`https://web-ai-gis.vercel.app/?selectedDataOption=${selectedDataOption.value}&x=${camera?.position.x}&y=${camera?.position.y}&z=${camera?.position.z}&selectedMapData=${selectedMapData}&colorMap=${colorMap}`}
          </div>
        </Dialog>
      )}
    </>
  );
};
