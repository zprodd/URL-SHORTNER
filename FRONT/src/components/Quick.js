import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "../context/UserContext";
import ErrorNotice from "./misc/ErrorNotice";

export default function Quick() {
  const [full, setfull] = useState();
  const [error, seterror] = useState();

  const { setUserData } = useContext(UserContext);

  const submit = async (e) => {
    try {
      e.preventDefault();
      const newQuick = { full };
      const quickRegister = await Axios.post(
        "http://localhost:5000/dashboard/quick",
        newQuick
      );
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };
  return (
    <div>
      <h2>QUICK</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => seterror(undefined)} />
      )}
      <form onSubmit={submit}>
        <label>full</label>
        <input onChange={(e) => setfull(e.target.value)} />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
