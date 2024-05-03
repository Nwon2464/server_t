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
      ).then(e=>{
          const newStreamsData = e.data.data;
          let allStreams = newStreamsData.slice();
          let urls= [],user_urls=[];
          // // console.log(newStreamsData);
          for(let i =0;i<5;i++ ) {
            urls.push(`https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[i].user_id}`);  
            user_urls.push(`https://api.twitch.tv/helix/users?id=${newStreamsData[i].user_id}`);
          //   // user_tags.push(`https://api.twitch.tv/helix/tags/streams`);
          }
          // console.log(allStreams,'dddddddddd');
      
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
          
          axios
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
          ]).then(
            axios.spread((...response) => {
              let gameName = [];
              let imageUrl = [];
              let tags = [];
              let description=[];
              response.map((data, i) => {
              
                data.data.data.map((res)=>{
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
                  if (res.hasOwnProperty("description")) {
                    // console.log(res);
                    description.push({
                      description: res["description"],
                      // profile_image_url: res["profile_image_url"],
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
              _.merge(allStreams, description);
    
              res.send(
                allStreams
              );
            })
          );
      });
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


router.get("/twitch/topgames", async (req, res) => {
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
        "https://api.twitch.tv/helix/games/top?first=8",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "client-id": client_id,
          },
        }
      );

      const newStreamsData = getStreamsRequest.data.data;
      // --------------------

      // console.log(newStreamsData);

      let allStreams = newStreamsData.slice();
      let URL1 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[0].id}`;
      let URL2 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[1].id}`;
      let URL3 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[2].id}`;
      let URL4 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[3].id}`;
      let URL5 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[4].id}`;
      let URL6 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[5].id}`;
      let URL7 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[6].id}`;
      let URL8 = `https://api.twitch.tv/helix/streams?game_id=${newStreamsData[7].id}`;

      const promise1 = axios.get(URL1, options);
      const promise2 = axios.get(URL2, options);
      const promise3 = axios.get(URL3, options);
      const promise4 = axios.get(URL4, options);
      const promise5 = axios.get(URL5, options);
      const promise6 = axios.get(URL6, options);
      const promise7 = axios.get(URL7, options);
      const promise8 = axios.get(URL8, options);

      await axios
        .all([
          promise1,
          promise2,
          promise3,
          promise4,
          promise5,
          promise6,
          promise7,
          promise8,
        ])
        .then(
          axios.spread((...response) => {
            // console.log(response);
            let gameViewers = [];
            response.map((data, i) => {
              // console.log(data.data);
              gameViewers.push({
                gameViewers: data.data.data
                  .map((e) => e.viewer_count)
                  .reduce((acc, cur) => acc + cur, 0),
              });
            });
            _.merge(allStreams, gameViewers);

            res.send(allStreams);
          })
        );
    }
  } catch (error) {
    console.log("ERROR287");
  }
});


router.get("/twitch/streams", async (req, res, next) => {
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
        "https://api.twitch.tv/helix/streams?first=8",
        options
      );
      const getTopGamesRequest = await axios.get(
        "https://api.twitch.tv/helix/games/top?first=8",
        options
      );

      const newStreamsData = getStreamsRequest.data.data.slice();
      const newTopGamesRequest = getTopGamesRequest.data.data.slice();
      ///////////////////////////
      //topgames

      let topGames = newTopGamesRequest.map((e) => {
        // console.log(e);
        return axios.get(
          `https://api.twitch.tv/helix/streams?game_id=${e.id}`,
          options
        );
      });
      let empty_topGames = [];
      //
      let topGames_fetched = await axios.all(topGames);
      topGames_fetched.map((e) => {
        empty_topGames.push({
          gameViewers: e.data.data
            .map((e) => e.viewer_count)
            .reduce((acc, cur) => acc + cur, 0),
        });
      });

      ///////////////////////////

      //To Get Game_NAME

      let game_name_data = newStreamsData.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_game_name = [];
      //
      let game_name_fetched = await axios.all(game_name_data);
      game_name_fetched.map((e) => {
        e.data.data.map((e) => {
          // console.log(e);
          empty_game_name.push({ game_name: e.game_name });
        });
      });

      ///////////////////////////
      let profileImageUrlAndFollowersAndDescriptions = newStreamsData.map(
        (e) => {
          return axios.get(
            `https://api.twitch.tv/helix/users?id=${e.user_id}`,
            options
          );
        }
      );

      let emptyProfileImageUrlAndFollowersAndDescriptions = [];
      let profileImageUrlAndFollowersAndDescriptionsFected = await axios.all(
        profileImageUrlAndFollowersAndDescriptions
      );
      profileImageUrlAndFollowersAndDescriptionsFected.map((e) => {
        e.data.data.map((e) => {
          // console.log(e);
          emptyProfileImageUrlAndFollowersAndDescriptions.push({
            description: e.description,
            profile_image_url: e.profile_image_url,
            followers: e.view_count,
          });
        });
      });

      /////////////////////////////////////////////////

      let tags = newStreamsData.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${e.user_id}`,
          options
        );
      });
      let empty_tags = [];

      let tags_fetched = await axios.all(tags);
      tags_fetched.map((e) => {
        empty_tags.push({
          localization_names: e.data.data.map(
            (e) => e.broadcaster_language
          ),
        });
      });
      //////////////////////////////
      //justchat STREAMS
      //////////////////////////////////////////////////
      //FORTNITE STREAMS

      // console.log(empty_topGames);
      _.merge(newTopGamesRequest, empty_topGames);
      _.merge(newStreamsData, empty_game_name);
      _.merge(newStreamsData, emptyProfileImageUrlAndFollowersAndDescriptions);
      _.merge(newStreamsData, empty_tags);

      res.send({
        frontPage: {
          allStreams: newStreamsData,
          topGames: newTopGamesRequest,
        },
      });
    }
  } catch (e) {
    res.status(500);
    next(e);
  }
});



// minecraft endpoints 
//https://api.twitch.tv/helix/channels?broadcaster_id= 
// tag replace with above link or else


router.get("/twitch/minecraft", async (req, res) => {
  // 509658
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
        "https://api.twitch.tv/helix/streams?game_id=27471&first=9",
        options
      );

      const newStreamsData = getStreamsRequest.data.data;
      // --------------------
      let allStreams = newStreamsData.slice();

      let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
      let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
      let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
      let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
      let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

      let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
      let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
      let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

      let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
      let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
      let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
      let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
      let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
      let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
      let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
      let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


      const promise1 = axios.get(URL1, options);
      const promise2 = axios.get(URL2, options);
      const promise3 = axios.get(URL3, options);
      const promise4 = axios.get(URL4, options);
      const promise5 = axios.get(URL5, options);
      const promise6 = axios.get(URL6, options);
      const promise7 = axios.get(URL7, options);
      const promise8 = axios.get(URL8, options);

      const promiseUser1 = axios.get(UserURL1, options);
      const promiseUser2 = axios.get(UserURL2, options);
      const promiseUser3 = axios.get(UserURL3, options);
      const promiseUser4 = axios.get(UserURL4, options);
      const promiseUser5 = axios.get(UserURL5, options);
      const promiseUser6 = axios.get(UserURL6, options);
      const promiseUser7 = axios.get(UserURL7, options);
      const promiseUser8 = axios.get(UserURL8, options);

      await axios
        .all([
          promise1,
          promise2,
          promise3,
          promise4,
          promise5,
          promise6,
          promise7,
          promise8,

          promiseUser1,
          promiseUser2,
          promiseUser3,
          promiseUser4,
          promiseUser5,
          promiseUser6,
          promiseUser7,
          promiseUser8,
        ])
        .then(
          axios.spread((...response) => {
            let gameName = [];
            let imageUrl = [];
            let tags = [];

            response.map((data, i) => {
              console.log(data);
              data.data.data.map((res) => {
                if (res.hasOwnProperty("profile_image_url")) {
                  // console.log(res);
                  imageUrl.push({
                    profile_image_url: res["profile_image_url"],
                  });
                }
                if (res.hasOwnProperty("game_id")) {
                  // console.log(res);
                  gameName.push({ game_name: res.game_name });
                }
                
                if(res.hasOwnProperty("broadcaster_language")){
                  tags.push({
                   localization_names:res["broadcaster_language"]
                 })
                }
              });
            });
            _.merge(allStreams, imageUrl);
            _.merge(allStreams, gameName);
            _.merge(allStreams, tags);
            
            
            res.send(allStreams);
          })
        );
    }
  } catch (error) {
    console.log("ERROR628");
  }
});


router.get("/twitch/fortnite", async (req, res) => {
  // 509658
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
        "https://api.twitch.tv/helix/streams?game_id=33214&first=9",
        options
      );

      const newStreamsData = getStreamsRequest.data.data;
      // --------------------
      let allStreams = newStreamsData.slice();

      let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
      let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
      let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
      let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
      let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

      let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
      let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
      let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

      let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
      let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
      let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
      let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
      let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
      let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
      let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
      let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


      const promise1 = axios.get(URL1, options);
      const promise2 = axios.get(URL2, options);
      const promise3 = axios.get(URL3, options);
      const promise4 = axios.get(URL4, options);
      const promise5 = axios.get(URL5, options);
      const promise6 = axios.get(URL6, options);
      const promise7 = axios.get(URL7, options);
      const promise8 = axios.get(URL8, options);

      const promiseUser1 = axios.get(UserURL1, options);
      const promiseUser2 = axios.get(UserURL2, options);
      const promiseUser3 = axios.get(UserURL3, options);
      const promiseUser4 = axios.get(UserURL4, options);
      const promiseUser5 = axios.get(UserURL5, options);
      const promiseUser6 = axios.get(UserURL6, options);
      const promiseUser7 = axios.get(UserURL7, options);
      const promiseUser8 = axios.get(UserURL8, options);

      await axios
        .all([
          promise1,
          promise2,
          promise3,
          promise4,
          promise5,
          promise6,
          promise7,
          promise8,

          promiseUser1,
          promiseUser2,
          promiseUser3,
          promiseUser4,
          promiseUser5,
          promiseUser6,
          promiseUser7,
          promiseUser8,
        ])
        .then(
          axios.spread((...response) => {
            let gameName = [];
            let imageUrl = [];
            let tags = [];

            response.map((data, i) => {
              console.log(data);
              data.data.data.map((res) => {
                if (res.hasOwnProperty("profile_image_url")) {
                  // console.log(res);
                  imageUrl.push({
                    profile_image_url: res["profile_image_url"],
                  });
                }
                if (res.hasOwnProperty("game_id")) {
                  // console.log(res);
                  gameName.push({ game_name: res.game_name });
                }
                
                if(res.hasOwnProperty("broadcaster_language")){
                  tags.push({
                   localization_names:res["broadcaster_language"]
                 })
                }
              });
            });
            _.merge(allStreams, imageUrl);
            _.merge(allStreams, gameName);
            _.merge(allStreams, tags);
            
            
            res.send(allStreams);
          })
        );
    }
  } catch (error) {
    console.log("ERROR628");
  }
});



router.get("/twitch/chat", async (req, res) => {
  // 509658
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
        "https://api.twitch.tv/helix/streams?game_id=509658&first=9",
        options
      );

      const newStreamsData = getStreamsRequest.data.data;
      // --------------------
      let allStreams = newStreamsData.slice();

      let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
      let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
      let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
      let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
      let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

      let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
      let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
      let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

      let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
      let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
      let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
      let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
      let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
      let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
      let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
      let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


      const promise1 = axios.get(URL1, options);
      const promise2 = axios.get(URL2, options);
      const promise3 = axios.get(URL3, options);
      const promise4 = axios.get(URL4, options);
      const promise5 = axios.get(URL5, options);
      const promise6 = axios.get(URL6, options);
      const promise7 = axios.get(URL7, options);
      const promise8 = axios.get(URL8, options);

      const promiseUser1 = axios.get(UserURL1, options);
      const promiseUser2 = axios.get(UserURL2, options);
      const promiseUser3 = axios.get(UserURL3, options);
      const promiseUser4 = axios.get(UserURL4, options);
      const promiseUser5 = axios.get(UserURL5, options);
      const promiseUser6 = axios.get(UserURL6, options);
      const promiseUser7 = axios.get(UserURL7, options);
      const promiseUser8 = axios.get(UserURL8, options);

      await axios
        .all([
          promise1,
          promise2,
          promise3,
          promise4,
          promise5,
          promise6,
          promise7,
          promise8,

          promiseUser1,
          promiseUser2,
          promiseUser3,
          promiseUser4,
          promiseUser5,
          promiseUser6,
          promiseUser7,
          promiseUser8,
        ])
        .then(
          axios.spread((...response) => {
            let gameName = [];
            let imageUrl = [];
            let tags = [];

            response.map((data, i) => {
              console.log(data);
              data.data.data.map((res) => {
                if (res.hasOwnProperty("profile_image_url")) {
                  // console.log(res);
                  imageUrl.push({
                    profile_image_url: res["profile_image_url"],
                  });
                }
                if (res.hasOwnProperty("game_id")) {
                  // console.log(res);
                  gameName.push({ game_name: res.game_name });
                }
                
                if(res.hasOwnProperty("broadcaster_language")){
                  tags.push({
                   localization_names:res["broadcaster_language"]
                 })
                }
              });
            });
            _.merge(allStreams, imageUrl);
            _.merge(allStreams, gameName);
            _.merge(allStreams, tags);
            
            
            res.send(allStreams);
          })
        );
    }
  } catch (error) {
    console.log("ERROR628");
  }
});




router.get("/twitch/fallguys", async (req, res) => {
  // 509658
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
        "https://api.twitch.tv/helix/streams?game_id=512980&first=9",
        options
      );

      const newStreamsData = getStreamsRequest.data.data;
      // --------------------
      let allStreams = newStreamsData.slice();

      let URL1 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[0].user_id}`;
      let URL2 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[1].user_id}`;
      let URL3 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[2].user_id}`;
      let URL4 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[3].user_id}`;
      let URL5 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[4].user_id}`;

      let URL6 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[5].user_id}`;
      let URL7 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[6].user_id}`;
      let URL8 = `https://api.twitch.tv/helix/channels?broadcaster_id=${newStreamsData[7].user_id}`;

      let UserURL1 = `https://api.twitch.tv/helix/users?id=${newStreamsData[0].user_id}`;
      let UserURL2 = `https://api.twitch.tv/helix/users?id=${newStreamsData[1].user_id}`;
      let UserURL3 = `https://api.twitch.tv/helix/users?id=${newStreamsData[2].user_id}`;
      let UserURL4 = `https://api.twitch.tv/helix/users?id=${newStreamsData[3].user_id}`;
      let UserURL5 = `https://api.twitch.tv/helix/users?id=${newStreamsData[4].user_id}`;
      let UserURL6 = `https://api.twitch.tv/helix/users?id=${newStreamsData[5].user_id}`;
      let UserURL7 = `https://api.twitch.tv/helix/users?id=${newStreamsData[6].user_id}`;
      let UserURL8 = `https://api.twitch.tv/helix/users?id=${newStreamsData[7].user_id}`;


      const promise1 = axios.get(URL1, options);
      const promise2 = axios.get(URL2, options);
      const promise3 = axios.get(URL3, options);
      const promise4 = axios.get(URL4, options);
      const promise5 = axios.get(URL5, options);
      const promise6 = axios.get(URL6, options);
      const promise7 = axios.get(URL7, options);
      const promise8 = axios.get(URL8, options);

      const promiseUser1 = axios.get(UserURL1, options);
      const promiseUser2 = axios.get(UserURL2, options);
      const promiseUser3 = axios.get(UserURL3, options);
      const promiseUser4 = axios.get(UserURL4, options);
      const promiseUser5 = axios.get(UserURL5, options);
      const promiseUser6 = axios.get(UserURL6, options);
      const promiseUser7 = axios.get(UserURL7, options);
      const promiseUser8 = axios.get(UserURL8, options);

      await axios
        .all([
          promise1,
          promise2,
          promise3,
          promise4,
          promise5,
          promise6,
          promise7,
          promise8,

          promiseUser1,
          promiseUser2,
          promiseUser3,
          promiseUser4,
          promiseUser5,
          promiseUser6,
          promiseUser7,
          promiseUser8,
        ])
        .then(
          axios.spread((...response) => {
            let gameName = [];
            let imageUrl = [];
            let tags = [];

            response.map((data, i) => {
              console.log(data);
              data.data.data.map((res) => {
                if (res.hasOwnProperty("profile_image_url")) {
                  // console.log(res);
                  imageUrl.push({
                    profile_image_url: res["profile_image_url"],
                  });
                }
                if (res.hasOwnProperty("game_id")) {
                  // console.log(res);
                  gameName.push({ game_name: res.game_name });
                }
                
                if(res.hasOwnProperty("broadcaster_language")){
                  tags.push({
                   localization_names:res["broadcaster_language"]
                 })
                }
              });
            });
            _.merge(allStreams, imageUrl);
            _.merge(allStreams, gameName);
            _.merge(allStreams, tags);
            
            
            res.send(allStreams);
          })
        );
    }
  } catch (error) {
    console.log("ERROR628");
  }
});



router.get("/twitch/streams/:id", async (req, res) => {
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
        `https://api.twitch.tv/helix/streams?game_id=${req.params.id}&first=100`,
        options
      );

      const getTopGames = await axios.get(
        `https://api.twitch.tv/helix/games?id=${req.params.id}`,
        options
      );

      const topGames = getTopGames.data.data;
      const sliced = getStreamsRequest.data.data.slice();
      const totalViews = getStreamsRequest.data.data
        .map((el) => el.viewer_count)
        .reduce((acc, curr) => {
          return acc + curr;
        });
      //
      const profileImage = getStreamsRequest.data.data.slice();

      let vr = profileImage.map((e) => {
        return axios.get(
          `https://api.twitch.tv/helix/users?id=${e.user_id}`,
          options
        );
      });

      let empty_followers = [];
      //

      let imageResult = await axios.all(vr);
      let ta2 = [];
      imageResult.map((e) => {
        // e.data.data.map((e) => console.log(e.vi));
        empty_followers.push({
          totalFollow: e.data.data
            .map((e) => e.view_count)
            .reduce((acc, cur) => acc + cur, 0),
        });

        e.data.data.map((e) => {
          // console.log(e)
          ta2.push({
            profile_image_url: e.profile_image_url,
            description: e.description,
          });
        });
      });
      const totalF = empty_followers
        .map((e) => e.totalFollow)
        .reduce((acc, cur) => acc + cur, 0);

      _.merge(sliced, ta2);

      //
      // let tags = [];
      let ar = getStreamsRequest.data.data.map((data) => {
        // console.log("------------>",data.tag_ids[0]);
        return axios.get(
          `https://api.twitch.tv/helix/users?id=${data.user_id}`,
          options
        );
      });
      let result = await axios.all(ar);
      let ta = [];
      result.map((e) => {
        e.data.data.map((e) => {
          // localization_names:res["broadcaster_language"]

          ta.push({ localization_names: e.broadcaster_language });
        });
      });
      _.merge(sliced, ta);
      res.json({
        totalFollowers: totalF,
        selectedGame: topGames,
        totalCurrentWatching: totalViews,
        streams: sliced,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/twitch/streams/user/:id", async (req, res) => {
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
        `https://api.twitch.tv/helix/videos?user_id=${req.params.id}&first=50`,
        options
      );

      // console.log(getStreamsRequest.data.data);
      // const getTopGames = await axios.get(
      //   `https://api.twitch.tv/helix/videos?id=${req.params.id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "client-id": client_id,
      //     },
      //   }
      // );
      res.json({ streams: getStreamsRequest.data.data });
    }
  } catch (e) {
    console.log(e);
  }
});

router.use('/emojis', emojis);

module.exports = router;
