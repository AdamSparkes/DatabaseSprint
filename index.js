const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres', //This _should_ be your username, as it's the default one Postgres uses
  host: 'localhost',
  database: 'movie_database', //This should be changed to reflect your actual database
  password: 'Creature1.', //This should be changed to reflect the password you used when setting up Postgres
  port: 5432,
});

/**
 * Creates the database tables, if they do not already exist.
 */
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Movies (
      movie_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      release_year INT NOT NULL,
      genre VARCHAR(50) NOT NULL,
      director VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Customers (
      customer_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone_number TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Rentals (
      rental_id SERIAL PRIMARY KEY,
      movie_id INT REFERENCES Movies(movie_id) ON DELETE CASCADE,
      customer_id INT REFERENCES Customers(customer_id) ON DELETE CASCADE,
      rental_date DATE DEFAULT CURRENT_DATE,
      return_date DATE
    );
  `);
  console.log('Mission accomplished Captain, connection to tables has been established.');
}

 


/**
 * Inserts a new movie into the Movies table.
 * 
 * @param {string} title Title of the movie
 * @param {number} year Year the movie was released
 * @param {string} genre Genre of the movie
 * @param {string} director Director of the movie
 */
async function insertMovie(title, year, genre, director) {
  await pool.query(
    `INSERT INTO Movies (title, release_year, genre, director) VALUES ($1, $2, $3, $4)`,
    [title, year, genre, director]
  );
  console.log(`Movie "${title}" added successfully.`);
};

/**
 * Prints all movies in the database to the console
 */
async function displayMovies() {
  const res = await pool.query('SELECT * FROM Movies');
  console.table(res.rows);
}


/**
 * Updates a customer's email address.
 * 
 * @param {number} customerId ID of the customer
 * @param {string} newEmail New email address of the customer
 */
async function updateCustomerEmail(customerId, newEmail) {
  await pool.query(
    `UPDATE Customers SET email = $1 WHERE customer_id = $2`,
    [newEmail, customerId]
  );
  console.log(`Customer ID ${customerId}'s email updated successfully.`);
};

/**
 * Removes a customer from the database along with their rental history.
 * 
 * @param {number} customerId ID of the customer to remove
 */
async function removeCustomer(customerId) {
  await pool.query('DELETE FROM Rentals WHERE customer_id = $1', [customerId]);
  await pool.query('DELETE FROM Customers WHERE customer_id = $1', [customerId]);
  console.log(`Customer ID ${customerId} and their rental history removed successfully.`);
}


/**
 * Prints a help message to the console
 */
function printHelp() {
  console.log('Reporting in Captain, all functionality for this program are shown below with formats included.');
  console.log('  insert : This will allow you to insert a new movie- give the following parameters in exact order as follows <Title> <Year> <Genre> <Director>');
  console.log('  show : This will give you a full report of all movies stored in the database Captain.');
  console.log('  update : This will allow you to update one of the customers email, you must first give the ID, then the new email. example being <1> <Captain@gmail.com>');
  console.log('  remove : This will allow you to purge a customer from our databse, filthy heathen.');
}
//<customer_id> <new_email>
/**
 * Runs our CLI app to manage the movie rentals database
 */
async function runCLI() {
  await createTable();

  const args = process.argv.slice(2);
  switch (args[0]) {
    case 'insert':
      if (args.length !== 5) {
        printHelp();
        return;
      }
      await insertMovie(args[1], parseInt(args[2]), args[3], args[4]);
      break;
    case 'show':
      await displayMovies();
      break;
    case 'update':
      if (args.length !== 3) {
        printHelp();
        return;
      }
      await updateCustomerEmail(parseInt(args[1]), args[2]);
      break;
    case 'remove':
      if (args.length !== 2) {
        printHelp();
        return;
      }
      await removeCustomer(parseInt(args[1]));
      break;
    default:
      printHelp();
      break;
  }
};

runCLI();
