To test with mongodb locally:

1. Run: `npx run-rs` to run a local mongo server. this runs as replica set, and transaction
   tests can be executeed against this set.
2. set DATABASE_URL like this: `DATABASE_URL=mongodb://localhost:27017`

Run your code.
