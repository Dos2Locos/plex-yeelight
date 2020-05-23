"use strict";

var express = require("express"),
  multer = require("multer");
const Yeelight = require("yeelight-node").Yeelight;

console.log("Player uuid is:", process.env.PLAYER_UUID);
console.log("Light ip is:", process.env.LIGHT_IP);
console.log("Light port is:", process.env.LIGHT_PORT);

console.log("Play mode is:", process.env.PLAY_MODE);
console.log("Play color temperature is:", process.env.PLAY_CT);
console.log("Play color is:", JSON.parse(process.env.PLAY_RGB));
console.log("Play bright is:", process.env.PLAY_BRIGHT);

console.log("Pause mode is:", process.env.PAUSE_MODE);
console.log("Pause color temperature is:", process.env.PAUSE_CT);
console.log("Pause color is:", JSON.parse(process.env.PAUSE_RGB));
console.log("Pause bright is:", process.env.PAUSE_BRIGHT);

console.log("Stop mode is:", process.env.STOP_MODE);
console.log("Stop color temperature is:", process.env.STOP_CT);
console.log("Stop color is:", JSON.parse(process.env.STOP_RGB));
console.log("Stop bright is:", process.env.STOP_BRIGHT);

const yeelight = new Yeelight({
  ip: process.env.LIGHT_IP,
  port: process.env.LIGHT_PORT,
});

var app = express();
var upload = multer({ dest: "/tmp/" });

app.post("/", upload.single("thumb"), function (req, res, next) {
  var payload = JSON.parse(req.body.payload);

  console.log("Got webhook for", payload.event);
  console.log("Player: ", process.env.PLAYER_UUID);

  if (
    payload.Player.uuid == process.env.PLAYER_UUID &&
    payload.Metadata.type != "track"
  ) {
    if (payload.event == "media.play" || payload.event == "media.resume") {
      yeelight
        .set_bright(process.env.PLAY_BRIGHT)
        .catch((reason) => console.log(reason));
      if (process.env.PLAY_MODE == 1) {
        yeelight
          .set_ct_abx(process.env.PLAY_CT)
          .then(() => {
            yeelight.closeConnection();
          })
          .catch((reason) => console.log(reason));
      } else {
        yeelight
          .set_rgb(JSON.parse(process.env.PLAY_RGB))
          .then(() => {
            yeelight.closeConnection();
          })
          .catch((reason) => console.log(reason));
      }
      yeelight
        .set_power("on", "smooth", 500, process.env.PLAY_MODE)
        .then(() => {
          yeelight.closeConnection();
          console.log("Movie light in PLAY mode");
        })
        .catch((reason) => console.log(reason));
      console.log("Play");
    } else if (payload.event == "media.pause") {
      yeelight
        .set_bright(process.env.PAUSE_BRIGHT)
        .catch((reason) => console.log(reason));;
      if (process.env.PAUSE_MODE == 1) {
        yeelight
          .set_ct_abx(process.env.PAUSE_CT)
          .catch((reason) => console.log(reason));;
      } else {
        yeelight
          .set_rgb(JSON.parse(process.env.PAUSE_RGB))
          .catch((reason) => console.log(reason));;
      }
      yeelight
        .set_power("on", "smooth", 500, process.env.PAUSE_MODE)
        .then(() => {
          yeelight.closeConnection();
          console.log("Movie light in PAUSE mode");
        })
        .catch((reason) => console.log(reason));;
      console.log("Pause");
    } else if (payload.event == "media.stop") {
      yeelight
        .set_bright(process.env.STOP_BRIGHT)
        .catch((reason) => console.log(reason));;
      if (process.env.STOP_MODE == 1) {
        yeelight
          .set_ct_abx(process.env.STOP_CT)
          .catch((reason) => console.log(reason));;
      } else {
        yeelight
          .set_rgb(JSON.parse(process.env.STOP_RGB))
          .catch((reason) => console.log(reason));;
      }
      yeelight
        .set_power("on", "smooth", 500, process.env.STOP_MODE)
        .then(() => {
          yeelight.closeConnection();
          console.log("Movie light in STOP mode");
        })
        .catch((reason) => console.log(reason));;
      console.log("Stop");
    }
  }

  res.sendStatus(200);
});

app.listen(12000);