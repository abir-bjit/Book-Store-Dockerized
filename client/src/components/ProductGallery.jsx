import "../App.scss";
import useUsers from "../hooks/useUsers";
import useProducts from "../hooks/useProducts";
import userService from "../services/user-service";

const ProductGallery = () => {
  const { products, error, setProducts, setError } = useProducts();
  console.log(products);
  const deleteUser = (user) => {
    const originalUsers = [...products];
    setProducts(products.filter((u) => u.id !== user.id));

    userService.delete(user.id).catch((err) => {
      setError(err.message);
      setProducts(originalUsers);
    });
  };

  const addUser = () => {
    const originalUsers = [...products];
    const newUser = { id: 0, name: "Mosh" };
    setProducts([newUser, ...products]);

    userService
      .create(newUser)
      .then(({ data: savedUser }) => setProducts([savedUser, ...products]))
      .catch((err) => {
        setError(err.message);
        setProducts(originalUsers);
      });
  };

  const updateUser = (user) => {
    const originalUsers = [...products];
    const updatedUser = { ...user, name: user.name + "!" };
    setProducts(products.map((u) => (u.id === user.id ? updatedUser : u)));

    userService.update(updatedUser).catch((err) => {
      setError(err.message);
      setProducts(originalUsers);
    });
  };

  return (
    <>
      {error && <p className="text-danger">{error}</p>}

      <ul className="list-group container">
        <li className="list-group-item d-flex justify-content-between">
          <button className="btn btn-primary mb-3" onClick={addUser}>
            Add
          </button>
        </li>
        {products.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between"
          >
            {user.name}
            <div>
              <button
                className="btn btn-outline-secondary mx-1"
                onClick={() => updateUser(user)}
              >
                Update
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProductGallery;
