// test-rate-limit.js
// test script to verify middleware.ts is working as expected

const fetch = require("node-fetch");

async function testRateLimit() {
  const url = "http://localhost:3000/api/advocates";

  for (let i = 0; i < 150; i++) {
    const response = await fetch(url);
    console.log(`Request ${i + 1}: Status ${response.status}`);
  }
}

testRateLimit();

/* 
result:

...

Request 97: Status 200
Request 98: Status 200
Request 99: Status 200
Request 100: Status 200
Request 101: Status 200
Request 102: Status 429
Request 103: Status 429
Request 104: Status 429
Request 105: Status 429
...

conclusion: The rate limit is working as expected. The first 100 requests are successful, 
but the 101st request is rate limited and returns a 429 status code.
*/
