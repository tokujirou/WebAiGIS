import { useState, useCallback } from "react";

export const useOpen = (): {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
} => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, onOpen, onClose };
};
