import styled from "styled-components";
import { motion } from "framer-motion";
import logo from "/img/logo.svg";

const Search = ({ searchInput, onChange }) => {
  return (
    <StyledNav>
      <Logo>
        <img src={logo} alt="" />
        <h1>BookStore</h1>
      </Logo>
      <form className="search">
        <input type="text" placeholder="Search by title" value={searchInput} onChange={onChange} />
        <button type="submit">Search</button>
      </form>
    </StyledNav>
  );
};

const StyledNav = styled(motion.nav)`
  padding: 3rem 5rem;
  text-align: center;
  input {
    width: 30%;
    font-size: 1.5rem;
    padding: 0.5rem;
    border: none;
    margin-top: 1rem;
    box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
  }
  button {
    font-size: 1.5rem;
    border: none;
    padding: 0.5rem 2rem;
    cursor: pointer;
    background: #ff7676;
    color: white;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  justify-content: center;
  padding: 1rem;

  img {
    height: 2rem;
    width: 2rem;
  }
`;

export default Search;
