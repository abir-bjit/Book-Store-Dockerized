import Button from "../../Atoms/Button/index";
import { currenciesDB } from "../../../database/currenciesDB";

const CurrencyBar = ({ setCurrency }) => {
  return Object.values(currenciesDB).map((cur) => (
    <Button key={cur.label} text={cur.code} className="btn-primary btn-sm" onClick={() => setCurrency(cur)} />
  ));
};

export default CurrencyBar;
