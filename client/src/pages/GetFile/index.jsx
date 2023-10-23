import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const GetFile = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
      <a
        href={`${import.meta.env.VITE_BACKEND}/files/get/${searchParams.get(
          "filepath"
        )}`}
      >
        Get File
      </a>
    </div>
  );
};

export default GetFile;
