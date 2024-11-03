CREATE TABLE Movies (
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    release_year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    director VARCHAR(100) NOT NULL
);

CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number TEXT NOT NULL
);


CREATE TABLE Rentals (
    rental_id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES Movies(movie_id),
    customer_id INT REFERENCES Customers(customer_id),
    rental_date DATE DEFAULT CURRENT_DATE,
    return_date DATE
);

INSERT INTO Movies (title, release_year, genre, director) VALUES
    ('Treasure Planet', 2002, 'Sci-Fi', 'John Musker'),
    ('Tarzan', 1999, 'Action', 'Kevin Lima'),
    ('Phantom Of the Opera', 2004, 'Drama', 'Joel Schumacher'),
    ('V is for Vendetta', 2005, 'Drama', 'James McTeigue'),
    ('Training Day', 2001, 'Action', 'Antoine Fuqua');

INSERT INTO Customers (first_name, last_name, email, phone_number) VALUES
    ('Adam', 'Sparkes', 'adsparkes@example.com', '999-1111'),
    ('Matthew', 'Sparkes', 'matty@example.com', '999-2222'),
    ('Ryan', 'Rose', 'rosie@example.com', '999-3333'),
    ('Michael', 'OBrien', 'elbaton@example.com', '999-4444'),
    ('Mahatma', 'Ghandi', 'bigGman@example.com', '999-5555');

INSERT INTO Rentals (movie_id, customer_id, rental_date, return_date) VALUES
    (1, 1, '2023-10-01', '2023-10-05'),
    (2, 2, '2023-10-02', '2023-10-09'),
    (3, 3, '2023-09-15', '2023-09-22'),
    (4, 4, '2023-10-05', '2023-10-12'),
    (5, 5, '2023-10-07', NULL),           
    (1, 2, '2023-10-08', NULL),           
    (3, 1, '2023-10-03', '2023-10-09'),
    (2, 3, '2023-09-28', '2023-10-03'),
    (4, 5, '2023-09-25', '2023-09-30'),
    (5, 1, '2023-10-10', NULL); 


--Find all movies rented by a specific customer, given their email. (Adam Sparkes)
SELECT m.title
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE c.email = 'adsparkes@example.com';

--Given a movie title, list all customers who have rented the movie (Treasure Planet)
SELECT c.first_name, c.last_name, c.email
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE m.title = 'Treasure Planet';

--Get the rental history for a specific movie title (Tarzan)
SELECT c.first_name, c.last_name, r.rental_date, r.return_date
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE m.title = 'Tarzan';

--For a specific movie director: Find the name of the customer, the date of the rental and title of the movie, each time a movie by that director was rented (John Musker)
SELECT c.first_name, c.last_name, r.rental_date, m.title
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE m.director = 'John Musker';


--List all currently rented out movies (movies who's return dates haven't been met)
SELECT m.title, c.first_name, c.last_name, r.rental_date, r.return_date
FROM Rentals r
JOIN Movies m ON r.movie_id = m.movie_id
JOIN Customers c ON r.customer_id = c.customer_id
WHERE r.return_date IS NULL;