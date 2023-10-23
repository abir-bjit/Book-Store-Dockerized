import "./footer.style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div className="col-md-6">
            <h3>About Us</h3>
            <p>Explore our wide range of books and find your next favorite read.</p>
          </div>
          <div className="col-md-6">
            <h3>Contact Information</h3>
            <ul>
              <li>Email: info@bookstore.com</li>
              <li>Phone: 123-456-7890</li>
              <li>Address: 123 Main Street, Cityville, State, Country</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
