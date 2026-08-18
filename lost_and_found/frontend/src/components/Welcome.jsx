import { Link } from "react-router-dom";
import "../css/main.css";

export default function Welcome() {
  return (
    <div className="welcomeScrollContainer">
      <section className="hero">
        <div className="heroInner">
          <div className="heroCopy">
            <p className="eyebrow">UCLA campus lost and found</p>
            <h1>Find what’s missing. Return what’s found.</h1>
            <p>
              Browse active reports, search by item type, or post something you
              lost or found around campus.
            </p>
            <div className="linkBar">
              <Link to="/browse">
                <button className="btnStyle">Browse reports</button>
              </Link>
              <Link to="/login">
                <button className="btnStyle secondaryBtn">Log in</button>
              </Link>
            </div>
          </div>

          <div className="quickPanel" aria-label="Lost and found workflow">
            <div>
              <span>1</span>
              <strong>Search first</strong>
              <p>Check recent lost and found reports before posting.</p>
            </div>
            <div>
              <span>2</span>
              <strong>Report clearly</strong>
              <p>Add category, location, contact info, and a photo if useful.</p>
            </div>
            <div>
              <span>3</span>
              <strong>Mark returned</strong>
              <p>Resolve your post once the item gets back home.</p>
            </div>
          </div>
        </div>

        <div className="featureStrip">
          <span>Lost</span>
          <span>Found</span>
          <span>Electronics</span>
          <span>Keys</span>
          <span>Wallets</span>
          <span>Bags</span>
        </div>
      </section>
    </div>
  );
}
