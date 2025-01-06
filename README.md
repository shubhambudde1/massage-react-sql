CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
   for database conne ction# massage-react-sql
