import { useOutletContext } from "react-router-dom";

const Contact = () => {
  const [{ currentCity }, setCurrentCity] = useOutletContext();
  
  const Change = () => setCurrentCity({ firstname: "changed", lastname: "changed" });
  return (
    <div>
      <h1>This is contact page</h1>
      <h1>First Name is {currentCity.firstname} </h1>
      <h1>Last Name is {currentCity.lastname} </h1>
      <button onClick={Change}>Change</button>
    </div>
  );
};

export default Contact;
