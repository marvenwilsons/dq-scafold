CREATE TABLE saved_transaction_purpose (
	id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
	title TEXT NOT NULL
)