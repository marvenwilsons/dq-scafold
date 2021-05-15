CREATE TABLE users (
    user_id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(500) NOT NULL,
    user_password VARCHAR(250) NOT NULL,
    user_settings jsonb NOT NULL,
    user_notes jsonb NOT NULL,
    user_activity jsonb NOT NULL
);