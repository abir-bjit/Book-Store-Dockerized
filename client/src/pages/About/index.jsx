import Layout from "@components/Templates/Layout";
import "./style.scss";
import { useSelector } from "react-redux";

const AboutPage = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <Layout>
      {user && <h4 className="mb-1">You are logged in as {user}</h4>}
      <div className="about-page">
        <h2>About Us</h2>
        <p>
          Welcome to our bookstore! We are passionate about providing a wide range of books to suit every reader's taste. Whether
          you're into fiction, non-fiction, or something else entirely, we've got you covered.
        </p>
        <p>
          Our mission is to promote a love for reading and make great literature accessible to all. Feel free to explore our
          collection and find your next favorite book!
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;
