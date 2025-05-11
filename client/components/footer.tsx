import React from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import "../styles/Footer.scss";

const Footer = () => {
  return (
    <footer className="Footer">
      <hr />
      <div className="footer-wrapper">
        <div className="footer-links">
          <Link className="u-link" href="/">Map</Link>
          <Link className="u-link" href="/pages/statedata">State Data</Link>
          <Link className="u-link" href="/pages/comparestates">Compare States</Link>
          <Link className="u-link" href="/pages/movingcalculator">Moving Calculator</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;