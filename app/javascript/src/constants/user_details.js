import { getFromLocalStorage } from "../utils/storage";

export const DEFAULT_PROFILE_IMAGE_URL =
  "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg";

export const PROFILE_IMAGE_URL =
  getFromLocalStorage("authProfileImageUrl") || DEFAULT_PROFILE_IMAGE_URL;

export const USER_ID = getFromLocalStorage("authUserId");
export const USER_NAME = getFromLocalStorage("authUserName");
export const USER_EMAIL = getFromLocalStorage("authEmail");
export const AUTH_TOKEN = getFromLocalStorage("authToken");
