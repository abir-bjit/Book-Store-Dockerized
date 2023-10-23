import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  let user = useSelector((state) => state.auth.auth);

  const handleLogOut = () => {
    user && localStorage.clear();
    user = null;
  };

  return (
    <header className="header">
      <nav className="container nav">
        <ul className="nav-list">
          <div className="nav-left">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" activeclassname="active">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link" activeclassname="active">
                About
              </NavLink>
            </li>
          </div>

          <div className="nav-right">
            <li className="nav-item">
              <NavLink className="nav-link" activeclassname="active" to="/cart">
                Cart
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeclassname="active" to="/store">
                Store
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" activeclassname="active" to="/registration">
                Registration
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink onClick={handleLogOut} className="nav-link" activeclassname="active" to="/login">
                {user ? "Log Out" : "Log In"}
              </NavLink>
            </li>
          </div>
        </ul>
      </nav>
      {/* <hr /> */}
      {/* <Outlet /> */}
    </header>
  );
};

export default Header;
