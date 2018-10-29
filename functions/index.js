const functions = require('firebase-functions');
// フロントからAPIを叩くとCORS問題が発生するがcorsを使うことで解決することができる
const cors = require('cors')({origin: true});
// GoogleMapのAPIを叩く用 keyはfirebaseで定義した環境変数から取得
const googleMapsClient = require('@google/maps').createClient({
  key: functions.config().api_key.google_map,
  Promise: Promise,
});


// GoogleMapのAPIを叩いて位置情報を取得しフロントに返す
exports.geocode = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      validateRequest(request);
      const res = await fetchGeocode(request.body);
      console.log(res);
      await response.status(200).send(res);
    } catch (e) {
      console.log(e);
      response.send(e);
    }
  });
});

// GoogleMapのAPIを叩いて近くの店情報を取得しフロントに返す
exports.nearBySearch = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      validateRequest(request);
      const res = await fetchNearBySearch(request.body);
      console.log(res);
      await response.status(200).send(res);
    } catch (e) {
      console.log(e);
      response.send(e);
    }
  });
});

async function fetchNearBySearch(query) {
  const nearBySearch = await googleMapsClient.placesNearby(query).asPromise();
  return nearBySearch.json.results;
}

async function fetchGeocode(query) {
  const geocode = await googleMapsClient.geocode(query).asPromise();
  return geocode.json.results;
}

// 例外をthrowしてエラーメッセージを返したい
function validateRequest(request) {
  if (request.method !== 'POST') {
    throw new Error('This is not post request');
  }
}