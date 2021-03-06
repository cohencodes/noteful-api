CREATE TABLE noteful_notes (
    note_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    folder_id INTEGER
        REFERENCES noteful_folders(folder_id) ON DELETE CASCADE NOT NULL,
    modified TIMESTAMP DEFAULT now() NOT NULL,
    content TEXT NOT NULL
);