import { routes } from "constants/routes";

import React from "react";

import { Book, List, Edit } from "@bigbinary/neeto-icons";
import classNames from "classnames";
import { Profile } from "components/commons";
import {
  NavLink,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";

const SideBar = () => {
  const { pathname } = useLocation();
  const profile_img_url =
    "https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg";

  return (
    <div className="flex w-20 flex-col items-center justify-between space-y-6 border-2 py-6 text-white shadow-sm">
      <div className="flex w-20 flex-col items-center space-y-6 text-white">
        <div className="rounded-lg bg-gray-800 p-2 text-2xl font-bold">
          <Book />
        </div>
        <NavLink
          to={routes.blogs.index}
          className={classNames({
            "text-blue-400": pathname === routes.blogs.index,
            "text-gray-400": pathname !== routes.blogs.index,
          })}
        >
          <List />
        </NavLink>
        <NavLink
          to={routes.blogs.create_blog}
          className={classNames({
            "text-blue-400": pathname === routes.blogs.create_blog,
            "text-gray-400": pathname !== routes.blogs.create_blog,
          })}
        >
          <Edit />
        </NavLink>
      </div>
      <Profile profile_img_url={profile_img_url} />
    </div>
  );
};

export default SideBar;
