import { useContext } from "react";
import AbacContext from "../contexts/AbacContext";

const useAbac = () => useContext(AbacContext);

export default useAbac;
