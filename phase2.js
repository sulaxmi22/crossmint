const axios = require('axios');
const BASE_URL = 'https://challenge.crossmint.io/api';
const CANDIDATE_ID = '4e560490-2e5b-4ea7-80f4-cddd0a2d96a4';

async function getGoalMap() {
    try {
        const response = await axios.get(`${BASE_URL}/map/${CANDIDATE_ID}/goal`);
        return response.data.goal;
    } catch (error) {
        console.error('Failed to fetch goal map:', error.message);
        throw error;
    }
}

async function getCurrentMap() {
    try {
        const response = await axios.get(`${BASE_URL}/map/${CANDIDATE_ID}`);
        return response.data.map;
    } catch (error) {
        console.error('Failed to fetch current map:', error.message);
        throw error;
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function deletePolyanet(row, column) {
    try {
        await axios.delete(`${BASE_URL}/polyanets`, {
            data: {
                row,
                column,
                candidateId: CANDIDATE_ID
            }
        });
        console.log(`Deleted POLYanet at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to delete POLYanet at (${row}, ${column}):`, error.message);
    }
}

async function deleteSoloon(row, column) {
    try {
        await axios.delete(`${BASE_URL}/soloons`, {
            data: {
                row,
                column,
                candidateId: CANDIDATE_ID
            }
        });
        console.log(`Deleted SOLoon at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to delete SOLoon at (${row}, ${column}):`, error.message);
    }
}

async function deleteCometh(row, column) {
    try {
        await axios.delete(`${BASE_URL}/comeths`, {
            data: {
                row,
                column,
                candidateId: CANDIDATE_ID
            }
        });
        console.log(`Deleted comETH at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to delete comETH at (${row}, ${column}):`, error.message);
    }
}

async function createPolyanet(row, column) {
    try {
        await axios.post(`${BASE_URL}/polyanets`, {
            row,
            column,
            candidateId: CANDIDATE_ID
        });
        console.log(`Created POLYanet at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to create POLYanet at (${row}, ${column}):`, error.message);
    }
}

async function createSoloon(row, column, color) {
    try {
        await axios.post(`${BASE_URL}/soloons`, {
            row,
            column,
            color: color.toLowerCase(),
            candidateId: CANDIDATE_ID
        });
        console.log(`Created ${color} SOLoon at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to create SOLoon at (${row}, ${column}):`, error.message);
    }
}

async function createCometh(row, column, direction) {
    try {
        await axios.post(`${BASE_URL}/comeths`, {
            row,
            column,
            direction: direction.toLowerCase(),
            candidateId: CANDIDATE_ID
        });
        console.log(`Created ${direction} comETH at (${row}, ${column})`);
    } catch (error) {
        console.error(`Failed to create comETH at (${row}, ${column}):`, error.message);
    }
}

async function cleanExistingObjects() {
    console.log('Fetching current map to clean existing objects...');
    const currentMap = await getCurrentMap();
    
    for (let row = 0; row < currentMap.length; row++) {
        for (let col = 0; col < currentMap[row].length; col++) {
            const cell = currentMap[row][col];
            if (cell.includes('POLYANET')) {
                await deletePolyanet(row, col);
            } else if (cell.includes('SOLOON')) {
                await deleteSoloon(row, col);
            } else if (cell.includes('COMETH')) {
                await deleteCometh(row, col);
            }
            if (cell !== 'SPACE') {
                await delay(1000);
            }
        }
    }
    console.log('Cleanup completed');
}

async function createLogo() {
    try {
        await cleanExistingObjects();
        console.log('Waiting after cleanup...');
        await delay(2000);

        const goalMap = await getGoalMap();
        console.log('Goal map fetched successfully');
        for (let row = 0; row < goalMap.length; row++) {
            for (let col = 0; col < goalMap[row].length; col++) {
                const cell = goalMap[row][col];
                
                if (cell === 'SPACE') continue;

                try {
                    if (cell === 'POLYANET') {
                        await createPolyanet(row, col);
                    } 
                    else if (cell.includes('SOLOON')) {
                        const color = cell.split('_')[0];
                        await createSoloon(row, col, color);
                    }
                    else if (cell.includes('COMETH')) {
                        const direction = cell.split('_')[0];
                        await createCometh(row, col, direction);
                    }
                    
                    await delay(1000);
                } catch (error) {
                    console.error(`Failed at position (${row}, ${col}). Retrying in 5 seconds...`);
                    await delay(5000);
                    try {
                        // Retry once
                        if (cell === 'POLYANET') {
                            await createPolyanet(row, col);
                        } else if (cell.includes('SOLOON')) {
                            const color = cell.split('_')[0];
                            await createSoloon(row, col, color);
                        } else if (cell.includes('COMETH')) {
                            const direction = cell.split('_')[0];
                            await createCometh(row, col, direction);
                        }
                    } catch (retryError) {
                        console.error(`Retry failed at position (${row}, ${col})`);
                    }
                }
            }
        }

        console.log('Logo creation completed!');
    } catch (error) {
        console.error('Failed to create logo:', error.message);
    }
}

console.log('Starting logo creation...');
createLogo().then(() => {
    console.log('Script completed successfully');
}).catch((error) => {
    console.error('Script failed:', error.message);
});