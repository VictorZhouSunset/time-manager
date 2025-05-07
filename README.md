# Time Manager

A Google Apps Script project for time and project management.

## Project Structure

This project consists of several JavaScript files that work together to manage projects, tasks, and calendar events in Google Sheets.

### Core Files

- `Constants.js` - Contains shared constants like sheet names and valid status values
- `ProjectService.js` - Handles project-related operations
- `TaskService.js` - Handles task-related operations
- `EventService.js` - Handles calendar event operations
- `TestUtils.js` - Contains shared utility functions for tests, like assertion helpers. (Assuming you adopted this)

### Test Files

- `ProjectTests.js` - Tests for project operations
- `TaskTests.js` - Tests for task operations
- `EventTests.js` - Tests for calendar event operations

## Development Setup

This project uses [clasp](https://github.com/google/clasp) for local development and deployment to Google Apps Script.

### Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm)
-   Google `clasp` CLI installed globally: `npm install -g @google/clasp`

### Getting Started

1.  **Clone the repository:**
    `git clone [your-repository-url]`
2.  **Navigate to the project directory:**
    `cd time-manager`
3.  **Log in to `clasp`:**
    `clasp login`
    (Follow the prompts to authorize `clasp` with your Google account.)
4.  **Set up your Google Sheet:**
    * Create a new Google Sheet in your Google Drive. This will serve as the database.
    * Inside this Google Sheet, create three sheets (tabs) named exactly: `Projects`, `Tasks`, and `CalendarEvents`.
    * Set up the header rows for each sheet according to the project's data model (see `ProjectService.js`, `TaskService.js`, `EventService.js` for expected fields or refer to the data model in the requirements document).
5.  **Create your `.clasp.json` file:**
    * Open the Google Sheet you just created.
    * Go to "Extensions" > "Apps Script". This will open the Apps Script editor bound to your Sheet.
    * In the Apps Script editor, go to "Project Settings" (the gear icon ⚙️ on the left).
    * Copy the "Script ID".
    * In your local project's root directory, create a file named `.clasp.json`.
    * Add the following content, replacing `"YOUR_SCRIPT_ID_GOES_HERE"` with the Script ID you copied:
        ```json
        {"scriptId":"YOUR_SCRIPT_ID_GOES_HERE","rootDir":"./"}
        ```
        (Assuming all your `.js` files are in the root. If you later move them to a `src` directory, change `rootDir` to `"./src"`).
6.  **Push initial files to your Apps Script project:**
    `clasp push`
    (You might be prompted to overwrite the manifest file `appsscript.json` if it's your first push to a new Apps Script project. Usually, you'd want to use your local version if you've configured it, or let `clasp` create a default one.)

### `.clasp.json` (Gitignored)

The `.clasp.json` file (which **should be in your `.gitignore` file**) contains the Google Apps Script project ID and the local root directory. Do not commit this file directly to a public repository. Instead, users should create their own based on their Script ID.

Example format:
`{"scriptId":"example-script-id","rootDir":"./"}`

### Common `clasp` commands

- `clasp login` - Login to Google Apps Script (one-time setup).
- `clasp logout` - Log out from Google Apps Script.
- `clasp push` - Push local changes to your bound Google Apps Script project.
- `clasp pull` - Pull changes from your bound Google Apps Script project to your local files.
- `clasp open` - Opens your bound Google Apps Script project in the online editor.
- `clasp status` - Shows files that will be pushed or ignored.

## Running Tests

1.  After pushing your code with `clasp push`, open your Apps Script project (e.g., using `clasp open` or via the Google Sheet's "Extensions" > "Apps Script" menu).
2.  In the Apps Script editor, select the test runner function you want to execute from the function dropdown list at the top (e.g., `runAllAddProjectTests` from `ProjectTests.js`).
3.  Click the "Run" button.
4.  Check the "Execution log" at the bottom of the editor for PASS/FAIL messages and any `Logger.log` output.
5.  Manually inspect your Google Sheet to verify data changes as expected.
