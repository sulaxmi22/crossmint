const axios = require('axios');
const BASE_URL = 'https://challenge.crossmint.io/api';
const CANDIDATE_ID = '4e560490-2e5b-4ea7-80f4-cddd0a2d96a4';

async function makePolyanet(row, column) {
    try {
        await axios.post(`${BASE_URL}/polyanets`, {
            row: row,
            column: column,
            candidateId: CANDIDATE_ID
        });
        console.log(`Polyanet created at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to create Polyanet at (${row}, ${column}): ${error.response?.data || error.message}`);
    }
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function makeCross() {
    const startIndex = 2;
    const endIndex = 8;
    const tasks = [];

    for (let i = startIndex; i <= endIndex; i++) {
        tasks.push({ row: i, column: i });
        tasks.push({ row: i, column: 10 - i });
    }

    const uniqueTasks = tasks.filter((task, index, self) =>
        index === self.findIndex(t => t.row === task.row && t.column === task.column)
    );

    for (const task of uniqueTasks) {
        await makePolyanet(task.row, task.column);
        await delay(1000);
    }

    console.log('X-shape created successfully!');
}

makeCross().catch(console.error);