import { Button, Dialog } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { Camera } from "three";

export const UrlGenerateButton: FC<{ camera: Camera | null }> = ({
  camera,
}) => {
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
        style={{ position: "absolute", right: 0, bottom: 0 }}
      >
        Generate URL
      </Button>

      {isOpen && (
        <Dialog open onClose={closeModal}>
          <div style={{ padding: "3rem" }}>
            {`https://web-ai-gis.vercel.app/?x=${camera?.position.x}&y=${camera?.position.y}&z=${camera?.position.z}`}
          </div>
        </Dialog>
      )}
    </>
  );
};
