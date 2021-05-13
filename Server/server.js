const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/refreshToken',(req,res)=>{
    const refreshToken = req.body.refreshToken;
    const spotifyApi = new SpotifyWebApi({
        clientId: '05450f477aeb45d98c58a4b810042c73',
        clientSecret: 'ef4f3d4f0d7641298be8be5c031e78e6',
        redirectUri: 'http://localhost:3000',
        refreshToken,
      }) 

      spotifyApi.refreshAccessToken()
      .then(
        data=> {
          //console.log(data.body);
            accessToken = data.body.accessToken,
            expiresIn = data.body.expiresIn
        })
        .catch(err=>{
            console.log('Error',err);
            res.sendStatus(400);
        });
     
      
})

app.post('/login',(req,res)=>{
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: '05450f477aeb45d98c58a4b810042c73',
        clientSecret: 'ef4f3d4f0d7641298be8be5c031e78e6',
        redirectUri: 'http://localhost:3000'
      }) 

      spotifyApi.authorizationCodeGrant(code)
      .then(data=>{
         // console.log(data,'data');
        res.json({
            accessToken:data.body.access_token,
            refreshToken:data.body.refresh_token,
            expireIn:data.body.expires_in
            })
        })
        .catch((err)=>{
           // console.log('err',err);
            res.sendStatus(400);
        })
})

app.listen(3001);