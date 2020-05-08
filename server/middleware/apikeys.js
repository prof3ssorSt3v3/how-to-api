const users = require('../data').users;
const MAX = process.env.API_MAX || 25;

const genKey = () => {
  //create a base-36 string that is always 30 chars long a-z0-9
  // 'an0qrr5i9u0q4km27hv2hue3ywx3uu'
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

const createUser = (_email, req) => {
  let today = new Date().toISOString().split('T')[0];
  let user = {
    _id: Date.now(),
    api_key: genKey(),
    email: _email,
    host: req.headers.origin, //  http://localhost:5500
    usage: [{ date: today, count: 0 }],
  };
  //When the developer registers a key, they typically provide a hostname where the key will
  // be used. We are getting that value from req.headers.origin which is what my browser sent
  console.log('add user');
  users.push(user);
  return user;
};

const validateKey = (req, res, next) => {
  //Where is the API key expected to be?
  let host = req.headers.origin;
  //let api_key = req.query.api_key; //version 1 with the querystring
  //let api_key = req.params.apikey; //version 2 with the URL params
  let api_key = req.header('x-api-key'); //version 3 using a header
  let account = users.find(
    (user) => user.host == host && user.api_key == api_key
  );
  // find() returns an object or undefined
  if (account) {
    //good match
    //check the usage
    let today = new Date().toISOString().split('T')[0];
    let usageIndex = account.usage.findIndex((day) => day.date == today);
    if (usageIndex >= 0) {
      //already used today
      if (account.usage[usageIndex].count >= MAX) {
        //stop and respond
        res.status(429).send({
          error: {
            code: 429,
            message: 'Max API calls exceeded.',
          },
        });
      } else {
        //have not hit todays max usage
        account.usage[usageIndex].count++;
        console.log('Good API call', account.usage[usageIndex]);
        next();
      }
    } else {
      //not today yet
      account.usage.push({ date: today, count: 1 });
      //ok to use again
      next();
    }
  } else {
    //stop and respond
    res.status(403).send({ error: { code: 403, message: 'You not allowed.' } });
  }
};

module.exports = { createUser, validateKey };
