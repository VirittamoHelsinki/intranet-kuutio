import React from "react";
import { Link } from "react-router-dom";
//import { fullName } from "../features/functions";

import useStore from "../store";
import Authorize from "./Authorize";
import "../styles/Header.scss";

const Header = () => {
  // const { user } = UserAuth();

  const { user } = useStore();

    // capitalize the first letter of a string.
    const capitalize = string => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  

  // get the full name of a user from an email address.
  const fullName = (email) => {
    const firstName = capitalize(email.split(".")[0])
    const lastName = capitalize(email.split(".")[1].split("@")[0])
    return `${firstName} ${lastName}`;
  }


  return (
    <div className="header-main">
      <Link to="/" className="header-label">
        Virittämö
      </Link>
      {/* {user ? 
      <label className="header-label">fullName</label> : 
      <label className="header-label">Ei käyttäjää</label>} */}
      <label className="header-label">
        {user ? fullName(user.email) : null}
      </label>

      <Authorize />
    </div>
  );
};

export default Header;
