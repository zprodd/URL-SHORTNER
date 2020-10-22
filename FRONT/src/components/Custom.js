import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "../context/UserContext";
import ErrorNotice from "./misc/ErrorNotice";

export default function Quick() {
  const [full, setfull] = useState();
  const [short, setshort] = useState();
  const [email, setemail] = useState();
  const [error, seterror] = useState();

  const { setUserData } = useContext(UserContext);

  const submit = async (e) => {
    try {
      e.preventDefault();
      const newQuick = { full, short, email };
      const quickRegister = await Axios.post(
        "http://localhost:5000/dashboard/custom",
        newQuick
      );
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };
  return (
    <div>
      <h2>CUSTOM</h2>
      {error && (
        <ErrorNotice message={error} clearError={() => seterror(undefined)} />
      )}
      <form onSubmit={submit}>
        <label>full</label>
        <input onChange={(e) => setfull(e.target.value)} />

        <label>short</label>
        <input onChange={(e) => setshort(e.target.value)} />

        <label>email</label>
        <input onChange={(e) => setemail(e.target.value)} />

        <input type="submit" value="Create" />
      </form>
    </div>
  );
}
