import React, { useState, useEffect } from "react";
import "./index.scss";
import { useParams, Navigate } from "react-router-dom";
import productService from "../../services/product-service";
import reviewService from "../../services/review-service";
import { coursesDB } from "../../database/coursesDB";
import Layout from "@components/Templates/Layout";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import { ToastContainer, toast } from "react-toastify";

const BookDetailsPage = () => {
  const [book, setBook] = useState();
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const params = useParams();

  const [reviewExists, setReviewExists] = useState(false);
  const [myReview, setMyReview] = useState("");
  const [myRating, setMyRating] = useState(null);
  const [editable, setEditable] = useState(false);
  const authSelector = useSelector((state) => state.auth.auth);

  // fetches product
  useEffect(() => {
    const request = productService.getOneById(params.id);
    request
      .then((res) => {
        console.log(res.data);
        setBook(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    const request = reviewService.getOneById(params.id);
    request
      .then((res) => {
        setReviews(res.data.data.reviews);
        setAverageRating(res.data.data.averageRating);
        const selfReview = res.data.data.reviews.filter((element) => element.user._id === authSelector.user.userId)[0];
        if (selfReview) {
          setReviewExists(true);
          setMyReview(selfReview.review);
          setMyRating(selfReview.rating);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  console.log("reviews", reviews.us);

  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/review/${!reviewExists ? "add" : "update"}-review/${authSelector.authId}`, {
      method: !reviewExists ? "POST" : "PATCH",
      body: JSON.stringify({
        rating: myRating,
        review: myReview,
        // id: authSelector.authId,
        productId: params.id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSelector.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.message);
        }
        toast.success(json.message);
        setEditable(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.message);
        setEditable(false);
        window.location.reload();
      });
  };

  const handleDelete = () => {
    console.log("first");
    fetch(`${import.meta.env.VITE_BACKEND}/review/delete-review/${authSelector.authId}/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authSelector.token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          throw new Error(json.message);
        }
        setReviewExists(false);
        setMyReview("");
        setMyRating(null);
        toast.success(json.message);
        // setEditable(false);
        window.location.reload();
      })
      .catch((err) => {
        toast.error(err.message);
        // setEditable(false);
        window.location.reload();
      });
  };

  return (
    <Layout>
      <ToastContainer hideProgressBar={true} />
      <div className="book-details-container container">
        {book ? (
          <>
            <div className="book-details-image">
              <img src={book.img ? book.img : coursesDB[0].img} alt={book.name} />
            </div>
            <div className="book-details-info">
              <h2>{book.name}</h2>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>Description:</strong> {book.description}
              </p>
              <p>
                <strong>Release Date:</strong> {book.releaseDate}
              </p>
              <p>
                <strong>Pages:</strong> {book.pages}
              </p>
              <p>
                <strong>Price:</strong> {book.price}
              </p>
              <p>
                <strong>Stock:</strong> {book.stock}
              </p>
              {/* <button className="add-to-cart-button">Add to Cart</button> */}
            </div>

            {reviews.length ? (
              <div className="review-section">
                <h2>Reviews</h2>
                <div className="form-group">
                  {editable ? (
                    <div className="review">
                      <h3>Name: {authSelector.user.name}</h3>
                      <input
                        type="text"
                        value={myReview}
                        onChange={(e) => {
                          setMyReview(e.target.value);
                        }}
                      />
                      <p>
                        Rating:{" "}
                        <Rating
                          onClick={(e) => {
                            setMyRating(e);
                          }}
                          initialValue={myRating ? myRating : 0}
                        />
                      </p>
                      <div>
                        <button className="btn-primary" onClick={handleSubmit}>
                          Submit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="review">
                      <h3>Name: {authSelector.user.name} </h3>
                      <p>{myReview}</p>
                      <p>Rating: {myRating}</p>
                      <button className="btn-primary" onClick={() => setEditable(!editable)}>
                        {reviewExists ? "Edit" : "Add"}
                      </button>
                      {reviewExists ? (
                        <button className="btn btn-danger" onClick={handleDelete}>
                          Delete
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
                {reviews.map((review, index) =>
                  review.user._id !== authSelector.user.userId ? (
                    <div key={index} className="review">
                      <h3>Name: {review.user.name} </h3>
                      <p>{review.review}</p>
                      <p>Rating: {review.rating}</p>
                    </div>
                  ) : null
                )}
                <div className="average-rating">
                  <p>
                    <strong>Average Rating:</strong> {averageRating}
                  </p>
                </div>
              </div>
            ) : (
              <h5
                style={{
                  marginTop: "1rem",
                }}
              >
                No Reviews Yet
              </h5>
            )}
          </>
        ) : (
          <h1>Loading</h1>
        )}
      </div>
    </Layout>
  );
};

export default BookDetailsPage;
