import "../App.scss";
import Book from "./Book";
import SearchComponent from "./SearchComponent";

const Books = ({ list }) => {
    console.log(list);
    return (
        <>
            <ul
                className="d-flex mt-1"
                style={{
                    flexWrap: "wrap",
                    gap: 30,
                }}
            >
                {list && list.length > 0 && list.map((item) => <Book key={item._id} book={item} />)}
            </ul>
            <div className="mt-1">
                <SearchComponent components={list ? list : []} />
            </div>
        </>
    );
};

export default Books;
