// index.js
const axios = require('axios');
const _ = require('lodash');

async function fetchAssetsList() {
    const apiUrl = 'https://api.fliplet.com/v1/widgets/assets';
    try {
        const response = await axios.get(apiUrl);
        if (
            response.data &&
            response.data.success &&
            Array.isArray(response.data.data) &&
            response.data.data.length > 0
        ) {
            return response.data.data.map((item) => item.asset);
        } else {
            throw new Error('Invalid or empty API response format');
        }
    } catch (error) {
        throw new Error('Failed to retrieve the assets list from the API: ' + error.message);
    }
}

async function parse(inputArray) {
    try {
        const assetsList = await fetchAssetsList();
        console.log("assetsList--", assetsList)
        const filteredAssets = assetsList.filter((asset) =>
            inputArray.some((input) => asset.indexOf(input) !== -1)
        );

        const sortedAssets = _.sortBy(filteredAssets, (asset) => {
            const index = inputArray.findIndex((input) => asset.indexOf(input) !== -1);
            return index === -1 ? Number.MAX_VALUE : index;
        });

        return Promise.resolve(sortedAssets);
    } catch (error) {
        return Promise.reject(error);
    }
}

parse(['bootstrap', 'fliplet-core', 'moment', 'jquery'])
    .then(function (assets) {
        console.log('The list is', assets);
    })
    .catch(function (error) {
        console.error('Error:', error.message);
    });
