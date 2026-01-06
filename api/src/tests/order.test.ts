import axios from "axios";

const tokens = [
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ0MGQxNGNlLWQxYzctNDExNi1hMDkxLTEyMjM5NmMyZDAwZiIsImVtYWlsIjoidXNlcjFAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Njc2MjU0MTgsImV4cCI6MTc2NzYyOTAxOH0.9vQSN8uHrVKhGH5500Zika_lRTZR4bSH_X9fleVCUVY",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExMmVkOGQ4LTVhYWItNGI4MC1iZDg3LWNkYjEyMDQ0OWM0NCIsImVtYWlsIjoidXNlcjJAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Njc2MjU0MDYsImV4cCI6MTc2NzYyOTAwNn0.Qw1Y54pcR8FoZQ5MF74gersQVVVWksc387s9Rger7ww",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRkODJkMDdlLTUxNjEtNDYyMC1hMTI0LTkyMjNkNTkzZjE4NiIsImVtYWlsIjoidXNlcjNAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Njc2MjUzOTAsImV4cCI6MTc2NzYyODk5MH0.v29hCulqzXIt8XYP8Mo3BRF03rNlyT9yMl7HVTi5amQ",
];

const productId = "cdfac2bc-cd7d-4110-a4f9-622d0114c11a";

async function run() {
  const requests = tokens.map((token) =>
    axios.post(
      "http://localhost:8000/order",
      {
        items: [
            {
                "id": productId,
                "quantity": 1
            }
        ]},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  const results = await Promise.allSettled(requests);

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
            console.log(`User ${i + 1}: SUCCESS`, r.value.status, r.value.data);
    } else {
        if (r.reason.response) {
            console.log(`User ${i + 1}: FAILED`, r.reason.response.status, r.reason.response.data);
        } else {
            console.log(`User ${i + 1}: ERROR`, r.reason.message);
        }
    }
    });
}

run();
