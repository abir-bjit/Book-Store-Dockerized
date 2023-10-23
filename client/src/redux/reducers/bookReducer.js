const initialState = {
    booksList: [],
  };
  
  const booksReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_PRODUCT":
        console.log("Products is calling ");
        return {
          ...state,
          booksList: [...state.booksList, action.payload],
        };
  
      default:
        return state;
    }
  };
  
export default booksReducer;