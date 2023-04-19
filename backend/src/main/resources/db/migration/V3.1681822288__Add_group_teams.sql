CREATE TABLE team_group (
  id VARCHAR(36) PRIMARY KEY,
  account_id VARCHAR(36) NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL
);