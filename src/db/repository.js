const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite DB file inside the same folder
const dbPath = path.join(__dirname, 'plans.db');

let db;

/**
 * Initialize the SQLite database and create tables if they do not exist
 */
function initDb() {
  db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    // Create plans table
    db.run(`
      CREATE TABLE IF NOT EXISTS plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goal TEXT NOT NULL
      )
    `);

    // Create steps table
    db.run(`
      CREATE TABLE IF NOT EXISTS steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plan_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY(plan_id) REFERENCES plans(id)
      )
    `);
  });

  console.log(`SQLite DB initialized at: ${dbPath}`);
}

/* Repository functions */

/**
 * Add a new plan and return its ID
 * @param {string} goal - The goal of the plan
 * @returns {Promise<number>} - ID of the created plan
 */
function addPlan(goal) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO plans (goal) VALUES (?)',
      [goal],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  console.log(`addPlan in db`);

  });
}

/**
 * Add a new step to a plan
 * @param {number} planId - ID of the parent plan
 * @param {string} title - Step description
 * @returns {Promise<number>} - ID of the created step
 */
function addStep(planId, title) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO steps (plan_id, title) VALUES (?, ?)',
      [planId, title],
      function (err) {
        if (err) return reject(err);
        
        console.log(`addStep ${this.lastID} in db - planId: ${planId}`);

        resolve({
          id: this.lastID,
          title: title,
          status: 'pending',
        });
      }
    );
  });
}


/**
 * Get a plan by its ID
 * @param {number} id - Plan ID
 * @returns {Promise<Object>} - Plan object
 */
function getPlanById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM plans WHERE id = ?',
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

/**
 * Get all steps for a given plan
 * @param {number} planId - Plan ID
 * @returns {Promise<Array>} - Array of steps
 */
function getStepsByPlanId(planId) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM steps WHERE plan_id = ?',
      [planId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

/**
 * Update the status of a step
 * @param {number} stepId - Step ID
 * @param {string} status - New status
 * @returns {Promise<number>} - Number of rows updated
 */
function updateStepStatus(stepId, status) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE steps SET status = ? WHERE id = ?',
      [status, stepId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
    console.log(`updateStep in db`);
  });
}

module.exports = {
  initDb,
  addPlan,
  addStep,
  getPlanById,
  getStepsByPlanId,
  updateStepStatus
};
