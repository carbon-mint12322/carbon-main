# Token Use Cases

1. Create immutable records. 

    We need to create data records that are immutable. We basically create a file (or a set of files) 
    and store a hash code of the data, user's ID, geo location, and timestamp on the blockchain. 

    In addition to storage, we need a way to verify that a particular piece of data has not been 
    tampered with. This can be done by comparing the hash code of the data that you've just 
    retrieved, with the hashcode on the blockchain.

2. Pay for services. We need to be able to pay for some services using our token:

    * Create immutable records (see above) - EvLocker app.  Some players would want 
      to pay in bulk for this service.
    * Spin up a branded Farmbook. Companies using our SaaS service and apps 
      dynamically create a set of servers by paying with our tokens.  This 
      could just be by paying with our token for subscription fees.

3. Rewards. We issue rewards to various stakeholders in Carbon Mint (farmers, 
   input suppliers, researchers, software developers, etc).  Most of the rewards 
   come from workflow steps in our platform, i.e. issued automatically by
   the server-side code.

4. Staking - Some service providers may be interested in buying the tokens and
   staking to (a) get returns on their funds and/or (b) get discounts for the 
   services they are buying.

5. Liquidity pools for our own fundraising.
