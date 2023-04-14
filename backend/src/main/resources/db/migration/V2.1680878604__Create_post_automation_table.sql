CREATE TABLE post_automation (
  id VARCHAR(36) PRIMARY KEY,
  account_id VARCHAR(36) NOT NULL,
  automation_name VARCHAR(255) NOT NULL,
  automation_description VARCHAR(255) NOT NULL,
  post_location VARCHAR(255),
  automation_date DATE NOT NULL,
  automation_time TIME NOT NULL
);