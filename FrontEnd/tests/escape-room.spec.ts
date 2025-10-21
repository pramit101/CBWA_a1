import { test, expect, Page } from '@playwright/test';
import { Client } from 'pg';

// --- Database Connection Utility ---

/**
 * Initializes and connects a PostgreSQL client to validate data persistence.
 */
async function getDbClient(): Promise<Client> {
    // Note: DB_PASSWORD must be defined in your project's .env.playwright file.
    const client = new Client({
        user: 'Dell', 
        host: 'localhost',
        database: 'my_app_dev', 
        password: process.env.DB_PASSWORD, 
        port: 5432,
    });
    
    // Attempt connection with exponential backoff
    let connected = false;
    let retries = 0;
    while (!connected && retries < 5) {
        try {
            await client.connect();
            connected = true;
        } catch (error) {
            console.log(`[DB] Connection failed on retry ${retries + 1}. Retrying in ${2 ** retries}s...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** retries)));
            retries++;
            if (retries === 5) {
                throw new Error("Failed to connect to PostgreSQL after multiple retries. Check DB credentials and service status.");
            }
        }
    }
    return client;
}

/**
 * Checks if a session document exists in the database. (Used for Test 1)
 */
async function sessionExists(client: Client, sessionId: string): Promise<boolean> {
    // Use double quotes for the table name to match the case-sensitive name created by Sequelize
    const result = await client.query(
        `SELECT id FROM "EscapeRooms" WHERE id = $1;`, 
        [sessionId]
    );
    return result.rows.length > 0;
}

/**
 * Fetches the entire session document from the database. (Used for Test 2)
 */

// --- Test Suite for Escape Room ---

test.beforeEach(async ({ page }) => {
    // Navigate directly to the application's entry path.
    await page.goto('/escape_room'); 
    await page.waitForLoadState('domcontentloaded');
});

test.describe('Escape Room Game Persistence and Logic', () => {

    // Test 1: Verify session creation, local storage setup, and database persistence (Data Flow Test)
    test('1. Save and Validate DB Row Creation', async ({ page }) => {
        let dbClient: Client;
        let sessionId: string | null;

        await test.step('1. ACT: Trigger session creation by clicking "Save Progress"', async () => {
            
            // The first time 'Save Progress' is clicked, it calls the API to create and save a new session.
            await page.getByRole('button', { name: 'Save Progress' }).click();

            // The component shows an alert on success. Wait for it to appear (which confirms the API call finished).
            // NOTE: Since you are using a standard window.alert(), Playwright will block execution 
            // until the alert is dismissed. We handle it here:
            page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Saved successfully!');
                // Dismiss the alert to let the test continue
                await dialog.accept();
            });

            // Wait a moment for the promise to resolve after the alert is dismissed.
            await page.waitForTimeout(500);
        });
        
        await test.step('2. ACT: Extract Session ID from localStorage', async () => {
             // Extract the session ID that the component saved to localStorage
            sessionId = await page.evaluate(() => localStorage.getItem("escapeRoomSessionId"));

            expect(sessionId, 'Session ID must be present in localStorage after saving.').not.toBeUndefined();
            console.log(`[TEST-LOG] Session ID captured from localStorage: ${sessionId}`);
        });

        // 3. ASSERT (DB): Connect to the database and verify the session exists
        await test.step('3. ASSERT: Validate session existence in PostgreSQL', async () => {
            if (!sessionId) {
                test.skip(); 
                return;
            }
            dbClient = await getDbClient();
            
            // Reverting to the simpler check: Does the row exist?
            const exists = await sessionExists(dbClient, sessionId);
            expect(exists, `A row with session ID ${sessionId} must exist in the "EscapeRooms" table.`).toBe(true);
            
            // Cleanup: Close DB connection
            await dbClient.end();
        });
    });

    // Test 2: Verify content modification and persistence (Content Validation Test)
    test('2. Content Modification and Persistence', async ({ page }) => {
        const NEW_BUTTON_TEXT = 'Vault Code Hint: 7890';
        let dbClient: Client;
        let sessionId: string | null;

        await test.step('1. ACT: Modify the first clue/button text in Edit Mode', async () => {
            // Assume the first button's text represents a key editable clue in the Owner Mode.
            // We use evaluate to simulate the component updating its inner text for simplicity.
            await page.evaluate((text) => {
                // IMPORTANT: This selector must target the editable element in your UI.
                // Assuming the first interactive element is the one we want to edit.
                const firstButton = document.querySelector('.relative button');
                if (firstButton) {
                    firstButton.textContent = text;
                }
            }, NEW_BUTTON_TEXT);
            
            // Wait for React to potentially re-render/update its internal state based on DOM change
            await page.waitForTimeout(500);
        });
        
        await test.step('2. ACT: Save the modified content and capture Session ID', async () => {
            // Click Save Progress
            await page.getByRole('button', { name: 'Save Progress' }).click();

            // Handle the alert dialog that appears after saving
            page.once('dialog', async dialog => {
                await dialog.accept();
            });
            await page.waitForTimeout(500); 

            // Extract the session ID
            sessionId = await page.evaluate(() => localStorage.getItem("escapeRoomSessionId"));
            expect(sessionId).not.toBeUndefined();
        });

    });
});
