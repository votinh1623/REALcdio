import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 300, // Number of virtual users
  duration: '30s', // Total duration of the test
};

export default function () {
  const res = http.get('http://localhost/api/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // Simulates user wait time between requests
}
