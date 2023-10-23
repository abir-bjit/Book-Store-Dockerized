import React from "react";
import { coursesDB } from "../database/coursesDB";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";
import Button from "./Atoms/Button/index";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
const BookDetail = (book) => {
  const [showDetail, isShowDetail] = useState(true);
  const handleBookDetails = () => {
    console.log("cross clicked");
    isShowDetail((show) => !show);
    console.log("showDetail", showDetail);
    // onClickToggle(false);
  };
  return (
    <CardShadow
      style={{
        display: !showDetail && "none",
      }}
    >
      <Detail>
        {/* <Button text={"X"} onClick={() => onClickToggle()} btnType={"button"} /> */}
        {/* <button onClick={() => handleBookDetails()}>X</button> */}
        <div className="remove-icon">
          <StyledFontAwesomeIcon
            style={{
              cursor: "pointer",
              textAlign: "right",
            }}
            icon={faTimes}
            onClick={() => handleBookDetails()}
          />
        </div>

        <Stats>
          <div className="rating">
            <h3>{book.book.name}</h3>
            <h4>{book.book.author}</h4>
            <p>{book.book.rating ? book.book.rating : "rating"}</p>
          </div>
          <Platforms>{/* <h3>{book.book.description}</h3> */}</Platforms>
        </Stats>
        <Media>
          <img src={coursesDB[0].img} alt="Image" />
        </Media>
        <Description>
          <p>{book.book.description}</p>
        </Description>
        <div className="gallery">
          {coursesDB.map((item, idx) => (
            <img key={idx} src={item.img} alt="gallery image" />
          ))}
        </div>
      </Detail>
    </CardShadow>
  );
};

const CardShadow = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  overflow-y: scroll;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ff7676;
  }

  &::-webkit-scrollbar-track {
    background-color: white;
  }
`;

const Detail = styled(motion.div)`
  width: 80%;
  border-radius: 1rem;
  padding: 2rem 10rem;
  background: white;
  color: black;
  position: absolute;
  left: 10%;
  img {
    width: 100%;
  }

  .remove-icon {
    text-align: right;
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  font-size: 2rem;
  //   color: white;
  text-align: right;

  &:hover {
    color: red;
    cursor: pointer;
  }
`;

const Stats = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    width: 2rem;
    height: 2rem;
    display: inline;
  }
`;

const Info = styled(motion.div)`
  text-align: center;
`;

const Platforms = styled(motion.div)`
  display: flex;
  justify-content: space-evenly;
  img {
    margin-left: 3rem;
  }
`;

const Media = styled(motion.div)`
  margin-top: 5rem;
  img {
    width: 100%;
    // height: 60vh;
    object-fit: cover;
  }
`;

const Description = styled(motion.div)`
  margin: 5rem 0rem;
`;

export default BookDetail;
