// Read the ingestedFiles.json file, find duplicate filenames, then use the REST API to delete the duplicates
// Usage: node deleteDuplicates.js
const ingestedFiles = require('./ingestedFiles.json').data;

const axios = require('axios');
const fs = require('fs');
const path = require('path');

let filenames = {};
let duplicates = [];

ingestedFiles.forEach((file) => {
    if (filenames[file.doc_metadata.file_name]) {
        duplicates.push(file.doc_id);
    } else {
        filenames[file.doc_metadata.file_name] = true;
    }
});

console.log(`Found ${duplicates.length} duplicates`);
// The endpoint is DELETE localhost:8001/v1/ingest/:doc_id

const deleteFile = async (doc_id) => {
    try {
        const response = await axios.delete(`http://localhost:8001/v1/ingest/${doc_id}`);
        console.log(`Deleted ${doc_id}`);
    } catch (error) {
        console.error(error);
    }
}

duplicates.forEach((doc_id) => {
    deleteFile(doc_id);
});

Object.keys(filenames).forEach((filename) => {
    const matches = ingestedFiles.filter((file) => file.doc_metadata.file_name === filename);
    if (matches.length > 1) {
        console.log(`Found ${matches.length} files with the same filename: ${filename}`);
    } else {
        console.log(`Found ${matches.length} files with the filename: ${filename}`);
    }
});