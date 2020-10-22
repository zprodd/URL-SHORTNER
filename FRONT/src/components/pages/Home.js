import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import AuthOptions from "../auth/AuthOptions";
import SuccessNotice from "../misc/SuccessNotice";

export default function Home() {
  const { userData } = useContext(UserContext);
  const [full, setfull] = useState();
  const [error, seterror] = useState();
  const [short, setshort] = useState();
  const [deleteCustomLink, setdeleteCustomLink] = useState();
  const [success, setsuccess] = useState();
  const [title, settitle] = useState();

  // const [email, setemail] = useState();
  // setemail(userData.user.displayName);
  // const email = userData.user.email;

  const submitQuick = async (e) => {
    try {
      e.preventDefault();
      
      const email = userData.user.email;
      const newQuick = { full ,email};
      const quickRegister = await Axios.post(
        "http://localhost:5000/users/quick",
        newQuick
      );
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };

  const submitCustom = async (e) => {
    try {
      e.preventDefault();

      console.log("button clicked");
      let config = {
        headers: {
          "x-auth-token": userData.token,
        },
      };


      const email = userData.user.email;
      const newQuick = { full, short, email ,title};
      const quickRegister = await Axios.post(
        "http://localhost:5000/users/custom",
        newQuick,config
      );
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };

  const deleteCustomLinkFunction = async (e) => {
    try {
      e.preventDefault();
      console.log("button clicked");
      let config = {
        headers: {
          "x-auth-token": userData.token,
        },
      };

      let data = {
        email: userData.user.email,
        short: deleteCustomLink,
      };

      var t = await Axios.post(
        "http://localhost:5000/users/deleteCustom",
        data,
        config
      );
      console.log(userData.token);
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };

  const a = async (e) => {
    try {
      e.preventDefault();
      
      const email = userData.user.email;
      const newQuick = { full ,email};
      const quickRegister = await Axios.post(
        "http://localhost:5000/users/quick",
        newQuick
      );
    } catch (err) {
      err.response.data.msg && seterror(err.response.data.msg);
      console.log(err);
    }
  };

  return (
    <div className="page">
      {userData.user ? (
        <div>
          <h1>Welcome {userData.user.displayName}</h1>
          <h1>EMAIL {userData.user.email}</h1>
          <h1>TOKEN {userData.token}</h1>
          <h2>QUICK CREATE</h2>
          {error && (
            <ErrorNotice
              message={error}
              clearError={() => seterror(undefined)}
            />
          )}

          {success && (
            <SuccessNotice
              message={success}
              clearSuccess={() => setsuccess(undefined)}
            />
          )}

          <form onSubmit={submitQuick}>
            <label>full</label>
            <input onChange={(e) => setfull(e.target.value)} />

            <input type="submit" value="Register" />
          </form>

          <h1>CUSTOM CREATE</h1>
          <form onSubmit={submitCustom}>
            <label>full</label>
            <input onChange={(e) => setfull(e.target.value)} />

            <label>short</label>
            <input onChange={(e) => setshort(e.target.value)} />

            <label>title</label>
            <input onChange={(e) => settitle(e.target.value)} />

            <input type="submit" value="Create" />
          </form>

          {/* <h2>DELETE CUSTOM</h2>
          <form onSubmit={deleteCustomLinkFunction}>
            <label>short</label>
            <input onChange={(e) => setDeleteCustomLink(e.target.value)} />

            <input type="submit" value="DeleteCustom" />
          </form> */}

          <form onSubmit={deleteCustomLinkFunction}>
            <label>DeletecustomLink </label>
            <br></br>
            <label>Enter the short URL to be deleted</label>
            <input onChange={(e) => setdeleteCustomLink(e.target.value)} />

            <input type="submit" value="DeleteCustom" />
          </form>

          <button onClick={a}>a</button>
        </div>
      ) : (
        ///////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////
        <>
          <h2>You are not logged in</h2>
          <Link to="/login">Log in</Link>

          <h2>QUICK</h2>
          {error && (
            <ErrorNotice
              message={error}
              clearError={() => seterror(undefined)}
            />
          )}
          <form onSubmit={submitQuick}>
            <label>full</label>
            <input onChange={(e) => setfull(e.target.value)} />

            <input type="submit" value="Register" />
          </form>
        </>
      )}
    </div>
  );
}
