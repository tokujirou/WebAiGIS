import { ChangeEventHandler, useCallback, useState } from "react";

export const useFile = (): {
  file: File | null;
  handleFile: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
} => {
  const [file, setFile] = useState<File | null>(null);
  const handleFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.currentTarget.files;
    if (!files || files?.length === 0) return;
    setFile(files[0]);
  };
  const onClear = useCallback(() => {
    setFile(null);
  }, []);

  return { file, handleFile, onClear };
};
