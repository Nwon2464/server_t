const express = require('express');

const emojis = require('./emojis');

const axios = require("axios");

const router = express.Router();

const _ = require("lodash");
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});



router.get("/twitch", async (req, res) => {
  console.log(client_id);
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const token = response.data.access_token;
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "client-id": client_id,
      },
    };

    console.log(token, "token");
    if (token) {
    
      console.log("WERWEREWREWR",token);
      const getStreamsRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?first=5",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "client-id": client_id,
          },
        }
      )
      // console.log("Token inflow");
      const newStreamsData = getStreamsRequest.data.data;
      let allStreams = newStreamsData.slice();
      let urls= [],user_urls=[];
      // console.log(newStreamsData);
      for(let i =0;i<5;i++ ) {
        urls.push(`https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[i].user_id}`);  
        user_urls.push(`https://api.twitch.tv/helix/users?id=${newStreamsData[i].user_id}`);
        // user_tags.push(`https://api.twitch.tv/helix/tags/streams`);
      }
      // console.log(urls,user_urls);
      console.log(allStreams);
  
      const promise1 = axios.get(urls[0], options);
      const promise2 = axios.get(urls[1], options);
      const promise3 = axios.get(urls[2], options);
      const promise4 = axios.get(urls[3], options);
      const promise5 = axios.get(urls[4], options);
      
      const promiseUser1 = axios.get(user_urls[0], options);
      const promiseUser2 = axios.get(user_urls[1], options);
      const promiseUser3 = axios.get(user_urls[2], options);
      const promiseUser4 = axios.get(user_urls[3], options);
      const promiseUser5 = axios.get(user_urls[4], options);
      
      // const promiseTag1 = axios.get(user_tags[0]);
      // const promiseTag2 = axios.get(user_tags[1]);
      // const promiseTag3 = axios.get(user_tags[2]);
      // const promiseTag4 = axios.get(user_tags[3]);

      await axios
      .all([
        promise1,
        promise2,
        promise3,
        promise4,
        promise5,
        promiseUser1,
        promiseUser2,
        promiseUser3,
        promiseUser4,
        promiseUser5,
        // promiseTag1,
        // promiseTag2,
        // promiseTag3,
        // promiseTag4,
      ]).then(
        axios.spread((...response) => {
          // console.log(response.data.data);
          // console.log("SSS");
          let gameName = [];
          let imageUrl = [];
          let tags = [];
          
          response.map((data, i) => {
            // console.log(data);
          
            data.data.data.map((res)=>{
              // console.log(res);
                if(res.hasOwnProperty("broadcaster_language")){
                 tags.push({
                  localization_names:res["broadcaster_language"]
                })
              }
              if (res.hasOwnProperty("profile_image_url")) {
                // console.log(res);
                imageUrl.push({
                  description: res["description"],
                  profile_image_url: res["profile_image_url"],
                });
              }
              if (res.hasOwnProperty("game_id")) {
                // console.log(res);
                gameName.push({ game_name: res.game_name });
              }
            })
          });
          _.merge(allStreams, imageUrl);
          _.merge(allStreams, gameName);
          _.merge(allStreams, tags);
 
          res.send(
            allStreams
          );
        })
      );
      
    }
  } catch (error) {
    console.log("ERROR206");
  }
});


router.use('/emojis', emojis);

module.exports = router;
