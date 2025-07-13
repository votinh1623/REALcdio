import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 500, // Number of virtual users
  duration: '30s', // Total duration of the test
};
// export let options = {
//   vus: 200,           // ... virtual users
//   duration: '30s',   // for ... seconds
//   thresholds: {
//     http_req_duration: ['p(95)<2000'],     // 95% of requests must be < 2s
//     http_req_failed: ['rate<0.01'],
//   },
// };

export default function () {
  const res = http.get('http://localhost:5000/api/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // Simulates user wait time between requests
}
