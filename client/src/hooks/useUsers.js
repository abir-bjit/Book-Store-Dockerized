import { useEffect, useState } from "react";
import { CanceledError } from "../services/api-client";
import userService from "../services/user-service";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true);
    const { request, cancel } = userService.getAll("/");
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => cancel();
  }, []);

  return { users, error, setUsers, setError, isLoading };
};

export default useUsers;
