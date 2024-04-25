# todo list

1. Locking implementation (including QR generation)
   - Main code
   - YAML changes to add locking step
1. codegen changes for templated views
1. Ensure that gridfs files are copied correctly to S3
1. Double check isForeignReference function (object-tree.ts)
1. Include AWS env vars
1. Check eventData vs data in the client/server interface for update event
1. Backward compatibility
1. Verify "createVersion"
1. Testability of workflow - including import functions - generate a separately testable package?

- Algorithms
- explore Lucy/xstate (xstate.js.org)

Done:

0. Basic lifecycle workflow implementation
1. Verify multiple edits of events, each going back to editable state
