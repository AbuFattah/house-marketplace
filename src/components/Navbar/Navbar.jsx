import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as ExploreIcon } from "../../assets/svg/exploreIcon.svg";
import { ReactComponent as OfferIcon } from "../../assets/svg/localOfferIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../../assets/svg/personOutlineIcon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    return location.pathname === route;
  };

  console.log("rendered navbar");
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              fill={`${pathMatchRoute("/") ? "#000" : "#666"}`}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offer")}>
            <OfferIcon
              fill={`${pathMatchRoute("/offer") ? "#000" : "#666"}`}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute("/offer")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Offer
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutlineIcon
              fill={`${pathMatchRoute("/profile") ? "#000" : "#666"}`}
              width="36px"
              height="36px"
            />
            <p
              className={
                pathMatchRoute("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
