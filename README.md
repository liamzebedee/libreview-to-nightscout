libreview-to-nightscout
=======================

**#WeAreNotWaiting** to OWN our own medical data. 

This uploads data from LibreView's exported CSV to a NightScout instance. See screenshots on [this Twitter thread](https://twitter.com/liamzebedee/status/1286177553552556033)

## Usage

Make sure you have Node.js v13.11.0 installed.

 1. Login to Libreview and download your glucose data CSV. This requires a CAPTCHA, so it can't be automated (yet). 
    
    ![Imgur](https://i.imgur.com/xrYcmHv.png)

    Copy this data into the `data/` directory of this repository.
 
 2. Now we transform the data into a minimal format usable by NightScout and other tools. You must set your timezone through the `TZ` variable, and specify the path to the CSV with `DATA_CSV`. 
 
   `TZ=Australia/Brisbane DATA_CSV=../data/DATA_FILENAME.csv node scripts/parse-librelink.js > data/libreview-parsed.json`
 
 3. Now we can upload the data. Specify your nightscout endpoint and API token (eg. rig-8abfe66c7). You will also have to specify the date from which you want data uploaded, as I'm not quite sure how/if Nightscout deduplicates data entries. Go to line 7 of `upload-to-nightscout.js`, and modify the `from` variable, which is a Unix timestamp. Then you can run:

   `NIGHTSCOUT_ENDPOINT_URL="" NIGHTSCOUT_API_TOKEN="" node ./scripts/upload-to-nightscout.js`

    You should see a large JSON blob of entries logged on success.

    ```js
    [
    {
        type: 'sgv',
        dateString: '2020-07-23T04:37:00.000Z',
        date: 1595479020000,
        sysTime: '2020-07-23T04:37:00.000Z',
        sgv: 219,
        noise: 1,
        utcOffset: 600
    },
    ...
    ```

## Bugs

 - I've used this for LibreView AU. It assumes the mmol/L standard for BGL's, so it won't work for mg/dl out-of-the-box.

