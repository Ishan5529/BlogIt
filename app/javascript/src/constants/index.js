import { toast, Slide } from "react-toastify";

const TOASTR_OPTIONS = {
  position: toast.POSITION.BOTTOM_CENTER,
  transition: Slide,
  theme: "colored",
};

const BLOGGABLE_THRESHOLD = 40;

export { TOASTR_OPTIONS, BLOGGABLE_THRESHOLD };
