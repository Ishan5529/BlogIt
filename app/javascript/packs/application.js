import "../stylesheets/application.scss";
import "../../../node_modules/@bigbinary/neetoui/dist/index.css";
import ReactRailsUJS from "react_ujs";
import App from "../src/App";

import { registerIntercepts, setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";

registerIntercepts();
initializeLogger();
setAuthHeaders();

const componentsContext = { App };
ReactRailsUJS.getConstructor = name => {
  return componentsContext[name];
};
