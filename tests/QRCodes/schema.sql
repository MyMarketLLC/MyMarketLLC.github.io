CREATE DATABASE IF NOT EXISTS qr_tracking;

USE qr_tracking;

CREATE TABLE IF NOT EXISTS page_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_type VARCHAR(20) NOT NULL,
    thoughts TEXT,
    scan_time TIME NOT NULL,
    time_spent INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);