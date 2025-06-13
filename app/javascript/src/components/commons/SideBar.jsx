import { routes } from "constants/routes";

import React, { useState, useEffect, useRef } from "react";

import {
  Book,
  List,
  Edit,
  ListDetails,
  LeftArrow,
} from "@bigbinary/neeto-icons";
import authApi from "apis/auth";
import { resetAuthTokens } from "apis/axios";
import classNames from "classnames";
import { Profile } from "components/commons";
import {
  NavLink,
  useLocation,
  Link,
} from "react-router-dom/cjs/react-router-dom.min";
import { setToLocalStorage } from "utils/storage";

import {
  PROFILE_IMAGE_URL,
  USER_NAME,
  USER_EMAIL,
  AUTH_TOKEN,
} from "../../constants/user_details";

const SideBar = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const isLoggedin = AUTH_TOKEN !== null;
  const menuRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setToLocalStorage({
        authToken: null,
        email: null,
        userId: null,
        userName: null,
      });
      resetAuthTokens();
      window.location.href = "/";
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <div className="flex w-20 flex-col items-center justify-between space-y-6 border-2 py-6 text-white shadow-sm">
      <div className="flex w-20 flex-col items-center space-y-6 text-white">
        <div className="rounded-lg bg-gray-800 p-2 text-2xl font-bold">
          <Book />
        </div>
        <NavLink
          to={routes.blogs.index}
          className={classNames({
            "text-blue-400":
              pathname === routes.blogs.index ||
              /^\/blogs\/[^/]+\/show\/?$/.test(pathname),
            "text-gray-400":
              pathname !== routes.blogs.index &&
              !/^\/blogs\/[^/]+\/show\/?$/.test(pathname),
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
        <NavLink
          to={routes.blogs.filter_blogs}
          className={classNames({
            "text-blue-400": pathname === routes.blogs.filter_blogs,
            "text-gray-400": pathname !== routes.blogs.filter_blogs,
          })}
        >
          <ListDetails />
        </NavLink>
      </div>
      <div className="relative" ref={menuRef}>
        <Profile profile_img_url={PROFILE_IMAGE_URL} onClick={toggleMenu} />
        {isMenuVisible && isLoggedin && (
          <div className="absolute bottom-1 left-20 z-20 mt-2 w-80 rounded-md border border-gray-300 bg-white pt-1 shadow-xl">
            <div className="flex flex-row items-center space-x-2 border-b-2 p-3">
              <Profile profile_img_url={PROFILE_IMAGE_URL} />
              <div className="flex flex-col">
                <p className="text-lg font-bold text-gray-800">{USER_NAME}</p>
                <p className="text-gray-800">{USER_EMAIL}</p>
              </div>
            </div>
            <Link
              className="block cursor-pointer px-3 py-2.5 text-base font-semibold text-gray-800 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LeftArrow className="mr-2 inline" />
              Log out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
