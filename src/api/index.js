const express = require('express');

const emojis = require('./emojis');

const axios = require("axios");

const router = express.Router();

const _ = require("lodash");
// CLIENT_ID = "otpjthd6a9addxg5qqv04x24yzo861"
// CLIENT_SECRET = "yjmcacd1c2r4w0dxwsglvfxujo5fuy"
const client_id = "otpjthd6a9addxg5qqv04x24yzo861";
const client_secret = "yjmcacd1c2r4w0dxwsglvfxujo5fuy";
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



router.get("/twitch/categories/all", async (req, res) => {
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

    if (token) {
      const getStreamsRequest = await axios.get(
        `https://api.twitch.tv/helix/games/top?first=100`,
        options
      );
      let topGames = getStreamsRequest.data.data.slice();
      ///////////////////////////
      //topgames

      let imageChanged = topGames.map((e) => {
        // console.log(e);
        return axios.get(
          `https://api.twitch.tv/helix/streams?game_id=${e.id}&first=100`,
          options
        );
      });
      let empty_topGames = [];
      //
      let topGames_fetched = await axios.all(imageChanged);
      topGames_fetched.map((e) => {
        console.log(e.data.data);
        empty_topGames.push({
          gameViewers: e.data.data
            .map((e) => e.viewer_count)
            .reduce((acc, cur) => acc + cur, 0),
        });
      });
      _.merge(topGames, empty_topGames);
      res.json({ topGames });
    }
  } catch (e) {
    console.log(e);
  }
});



router.get("/twitch/streams/contents", async (req, res) => {
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

    if (token) {
      const getJustChatRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?game_id=509658&first=8",
        options
      );

      const getFortNiteRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?game_id=33214&first=8",
        options
      );
      const getFallGuyRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?game_id=512980&first=8",
        options
      );
      const getMineCraftRequest = await axios.get(
        "https://api.twitch.tv/helix/streams?game_id=27471&first=9",
        options
      );
      const newJustChatRequest = getJustChatRequest.data.data.slice();

      const newFortNiteRequest = getFortNiteRequest.data.data.slice();
      const newFallGuyRequest = getFallGuyRequest.data.data.slice();
      const newMineCraftRequest = getMineCraftRequest.data.data.slice();
      // https://api.twitch.tv/helix/channels
      let justChatStreams = newJustChatRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });

      let empty_just_chat = [];
      //
      let justChatFetched = await axios.all(justChatStreams);
      justChatFetched.map((e) => {
        e.data.data.map((e) => {
          empty_just_chat.push({ game_name: e.game_name });
        });
      });

      //justCHAT IMAGEURL FOLLWERS DESCRI
      let just_chat_profile_image_url_and_followers_andDescriptions = newJustChatRequest.map(
        (e) => {
          return axios.get(
            `https://api.twitch.tv/helix/users?id=${e.user_id}`,
            options
          );
        }
      );

      let empty_just_chat_profile_image_url_and_followers_andDescriptions = [];
      let just_chat_profile_image_url_and_followers_andDescriptionsFetched = await axios.all(
        just_chat_profile_image_url_and_followers_andDescriptions
      );
      just_chat_profile_image_url_and_followers_andDescriptionsFetched.map(
        (e) => {
          e.data.data.map((e) => {
            // console.log(e);
            empty_just_chat_profile_image_url_and_followers_andDescriptions.push(
              {
                description: e.description,
                profile_image_url: e.profile_image_url,
                followers: e.view_count,
              }
            );
          });
        }
      );
      //justchat TAGs
      let just_chat_tags = newJustChatRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_just_chat_tag = [];
      //
      let just_chat_tags_fetched = await axios.all(just_chat_tags);
      just_chat_tags_fetched.map((e) => {
        empty_just_chat_tag.push({
          "localization_names": e.data.data.map(
            (e) => e.broadcaster_language
          ),
        });
      });
      // console.log("sdffffffffffffffffffffffffffffffff",empty_just_chat);

      let fortNiteStreams = newFortNiteRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_fortNite_streams = [];
      //
      let fortNiteStreams_fetched = await axios.all(fortNiteStreams);
      fortNiteStreams_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_fortNite_streams.push({
            game_name: e.game_name,
          });
        });
      });
      //image followers dscription
      let fortNiteStreams_image_followers_description = newFortNiteRequest.map(
        (e) => {
          return axios.get(
            `https://api.twitch.tv/helix/users?id=${e.user_id}`,
            options
          );
        }
      );
      let empty_fortNiteStreams_image_followers_description = [];
      //
      let fortNiteStreams_image_followers_description_fetched = await axios.all(
        fortNiteStreams_image_followers_description
      );
      fortNiteStreams_image_followers_description_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_fortNiteStreams_image_followers_description.push({
            description: e.description,
            profile_image_url: e.profile_image_url,
            followers: e.view_count,
          });
        });
      });

      //tags
      let fortNite_tags = newFortNiteRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_fortNite_tags = [];
      //
      let fortNite_tags_fetched = await axios.all(fortNite_tags);
      fortNite_tags_fetched.map((e) => {
        empty_fortNite_tags.push({
          "localization_names": e.data.data.map(
            (e) => e.broadcaster_language
          ),
        });
      });

      ////////////////////////////////////////////////
      //Fallguy streams

      let FallGuyStreams = newFallGuyRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_FallGuyStreams = [];
      //
      let FallGuyStreams_fetched = await axios.all(FallGuyStreams);
      FallGuyStreams_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_FallGuyStreams.push({
            game_name: e.game_name,
          });
        });
      });

      //
      let fallGuyStreams_image_followers_description = newFallGuyRequest.map(
        (e) => {
          return axios.get(
            `https://api.twitch.tv/helix/users?id=${e.user_id}`,
            options
          );
        }
      );
      let empty_fallGuyStreams_image_followers_description = [];
      //
      let fallGuyStreams_image_followers_description_fetched = await axios.all(
        fallGuyStreams_image_followers_description
      );
      fallGuyStreams_image_followers_description_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_fallGuyStreams_image_followers_description.push({
            description: e.description,
            profile_image_url: e.profile_image_url,
            followers: e.view_count,
          });
        });
      });
      let fallGuy_tags = newFallGuyRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_fallGuy_tag = [];
      //
      let fallGuy_tags_fetched = await axios.all(fallGuy_tags);
      fallGuy_tags_fetched.map((e) => {
        empty_fallGuy_tag.push({
          localization_names: e.data.data.map(
            (e) => e.broadcaster_language
          ),
        });
      });

      ////////////////////////////////////////

      let minCraftStreams = newMineCraftRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_minCraftStreams = [];
      //
      let minCraftStreams_fetched = await axios.all(minCraftStreams);
      minCraftStreams_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_minCraftStreams.push({
            game_name: e.game_name,
          });
        });
      });

      //
      let minCraft_image_followers_and_description = newMineCraftRequest.map(
        (e) => {
          return axios.get(
            `https://api.twitch.tv/helix/users?id=${e.user_id}`,
            options
          );
        }
      );
      let empty_minCraft_image_followers_and_description = [];
      //
      let minCraft_image_followers_and_description_fetched = await axios.all(
        minCraft_image_followers_and_description
      );
      minCraft_image_followers_and_description_fetched.map((e) => {
        e.data.data.map((e) => {
          empty_minCraft_image_followers_and_description.push({
            description: e.description,
            profile_image_url: e.profile_image_url,
            followers: e.view_count,
          });
        });
      });
      //
      let mineCraft_tags = newMineCraftRequest.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_mineCraft_tags = [];
      //
      let mineCraft_tags_fetched = await axios.all(mineCraft_tags);
      mineCraft_tags_fetched.map((e) => {
        empty_mineCraft_tags.push({
          localization_names: e.data.data.map(
            (e) => e.broadcaster_language
          ),
        });
      });

      _.merge(newJustChatRequest, empty_just_chat);
      _.merge(newJustChatRequest, empty_just_chat_tag);
      _.merge(
        newJustChatRequest,
        empty_just_chat_profile_image_url_and_followers_andDescriptions
      );

      //      newFortNiteRequest newMineCraftRequest newFallGuyRequest
      _.merge(newMineCraftRequest, empty_minCraftStreams);
      _.merge(
        newMineCraftRequest,
        empty_minCraft_image_followers_and_description
      );
      _.merge(newMineCraftRequest, empty_mineCraft_tags);

      //
      _.merge(newFallGuyRequest, empty_FallGuyStreams);
      _.merge(
        newFallGuyRequest,
        empty_fallGuyStreams_image_followers_description
      );
      _.merge(newFallGuyRequest, empty_fallGuy_tag);
      //
      _.merge(newFortNiteRequest, empty_fortNite_streams);
      _.merge(
        newFortNiteRequest,
        empty_fortNiteStreams_image_followers_description
      );
      _.merge(newFortNiteRequest, empty_fortNite_tags);

      res.send({
        frontPage: {
          justChat: newJustChatRequest,
          fallGuy: newFallGuyRequest,
          fortNite: newFortNiteRequest,
          mineCraft: newMineCraftRequest,
        },
      });
    }
  } catch (e) {
    console.log("ERRRRRR");
  }
});


router.use('/emojis', emojis);

module.exports = router;
