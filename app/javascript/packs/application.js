import "../stylesheets/application.scss";

import { setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";

initializeLogger();
setAuthHeaders();
