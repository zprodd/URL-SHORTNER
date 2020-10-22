import React, { useState, useContext, useEffect } from "react";
import Axios from "axios";
import UserContext from "../context/UserContext";
import ErrorNotice from "./misc/ErrorNotice";
import {
  useParams
} from "react-router-dom";

export default function Quick() {

  let params = useParams();

  //const { setUserData } = useContext(UserContext);
  const { userData } = useContext(UserContext);
  const [title, settitle] = useState();
  const [fullLink, setfullLink] = useState();
  var [found, setfound] = useState();
  // var found =false;

  const no = async (e) => {
    try {
      e.preventDefault();
      console.log("clicked NO");
    } catch (err) {
      console.log(err);
    }
  };

  const yes = async (e) => {
    try {
      e.preventDefault();
      console.log("clicked YES !!");
      //console.log(this.props.match.params.z);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    //setfound(true);
    //console.log("use effect start in z");
    console.log(found);
    // console.log('1');
    // console.log('2');
    // console.log('use effect start in app.js 2')
    const checkLoggedIn = async () => {
      try {
        console.log("hii");
        //console.log(this.props.location.query);
        // console.log('done');
        // console.log(params.z);
        var getlink = "http://localhost:5000/users/" + params.z
        // console.log(getlink);

        const a = await Axios.post(getlink);
        console.log("-------a-------");
        console.log(a);
        setfound(a.data.found);
        settitle(a.data.title);
        setfullLink(a.data.fullUrl);
        // console.log('titel is ');
        // console.log(title);


      } catch (error) {
        console.log(error);
      }
    };

    checkLoggedIn();
  }, []);


  // return (
  //   <div className="page">
  //     {/* {found? ():()} */}
  //     <>
  //       <div>

  //       <h1>{params.z}</h1>


  //         <h3>REDIRECTING U NIGGA</h3>
  //         <h2>Do you Want to redirect to ??</h2>
  //         <h1>{title}</h1>
  //         <h3>{fullLink}</h3>
  //         {/* <h3>{this.props.match.params.z}</h3> */}
  //         {/* <button onclick="yes()">YES</button>
  //         <button onClick="yes"></button> */}
  //         <button
  //           type="button"
  //           onClick={(e) => {
  //             e.preventDefault();
  //             window.location.href = fullLink;
  //           }}
  //         > YES</button>

  //         <br></br>

  //         <button
  //           type="button"
  //           onClick={(e) => {
  //             // e.preventDefault();
  //             // window.location.href = fullLink;
  //             console.log('Clicked NO');
  //           }}
  //         > NO</button>


  //       </div>
  //     </>
  //   </div>
  // );

  return (
    <div className="page">
      {found ? (
        <div>

          {/* <h1>if true</h1> */}

          {/* <h1>{params.z}</h1> */}


          <h3>REDIRECTING U NIGGA</h3>
          <h2>Do you Want to redirect to ??</h2>
          <h1>{title}</h1>
          <h3>{fullLink}</h3>
          {/* <h3>{this.props.match.params.z}</h3> */}
          {/* <button onclick="yes()">YES</button>
          <button onClick="yes"></button> */}
          <h2>Do you Want to redirect  ??</h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = fullLink;
            }}
          > YES</button>

          <br></br>

          <button
            type="button"
            onClick={(e) => {
              // e.preventDefault();
              // window.location.href = fullLink;
              console.log('Clicked NO');
            }}
          > NO</button>
          
        </div>
      ) : (
          <>
            <h1>NOTHING FOUND NIGGA .. !!</h1>
            <h1>Recheck the Url</h1>
          </>
        )}
    </div>
  );
}
