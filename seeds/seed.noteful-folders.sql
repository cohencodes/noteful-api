INSERT INTO noteful_folders (
  name
) VALUES 
  ('important'), 
  ('trash'), 
  ('test');

INSERT INTO noteful_notes (
  name, folder_id, content
) VALUES 
  ('first note', 1, 'this is the first test note'),
  ('second note', 2, 'this is the second test note'),
  ('third note', 3, 'this is the third test note');