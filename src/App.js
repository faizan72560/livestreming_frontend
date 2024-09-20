import React, { useEffect, useState } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import "./App.css";

// Set the Zoom Web SDK libraries
ZoomMtg.setZoomJSLib("https://source.zoom.us/2.18.2/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load("en-US");
ZoomMtg.i18n.reload("en-US");

function App() {
  const sdkKey = "IyVCvQWZTXGCbNuoIk1eaQ"; // Replace with your Zoom SDK key
  const meetingNumber = 76710934955; // Replace with your meeting number
  const passWord = "Lu9a6A"; // Replace with your meeting password
  // const signature = "YOUR_SIGNATURE"; // Replace with a valid Zoom signature
  const userName = "Md Faizan"; // Replace with your name
  const leaveUrl = "http://localhost:3000"; // URL to navigate to after leaving the meeting
  const role = 1;
  const [signature, setSignature] = useState("");

  useEffect(() => {
    // joinMeeting();
    getSignature();
  }, []);

  const getSignature = async (event) => {
    try {
      // event.preventDefault();

      // hit the remote experss server to retrieve signature
      // meetingNumber and role are must.
      // role 0 means attendee, 1 stands for host
      const responseFromSignatureEndpoint = await fetch(
        "https://livestreambackend.vercel.app/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingNumber,
            role,
          }),
        }
      );

      // if signature is retrieved successfully, then attempt to start meeting
      const signatureJSON = await responseFromSignatureEndpoint.json();
      console.log(signatureJSON);
      if (signatureJSON) {
        setSignature(signatureJSON?.signature);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (signature) joinMeeting();
    // if (signature) createZoomMeeting();
  }, [signature]);

  function joinMeeting() {
    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: () => {
        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          success: (res) => {
            console.log("Successfully joined the meeting", res);
          },
          error: (err) => {
            console.error("Error joining the meeting", err);
          },
        });
      },
      error: (err) => {
        console.error("Error initializing Zoom SDK", err);
      },
    });
  }

  const createZoomMeeting = async () => {
    try {
      const response = await fetch("http://localhost:4000/create-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "faizanahmad72560@gmail.com",
          topic: "React Zoom Meeting",
          duration: 30,
          password: "123456",
          agenda: "Discuss React project",
          meetingNumber: 123467,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Meeting created:", data);
      } else {
        console.error("Error creating meeting:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Join Zoom Meeting</h1>
      <button onClick={joinMeeting}>Join Meeting</button>
    </div>
  );
}

export default App;
