import { atom } from "recoil";
export type UploadedModelJsonState = string;

export const uploadedModelJsonState = atom({
  key: "UploadedModelJsonState",
  default: "",
});
