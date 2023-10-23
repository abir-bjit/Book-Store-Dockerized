import Header from "@components/Molecules/Header";
import Footer from "@components/Molecules/Footer";

const Layout = ({ children }) => {
  return (
    <>
      <div className="container">
        <Header />
        {children}
        <div
          style={{
            height: "100vh",
          }}
        ></div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
