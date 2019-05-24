const NotesService = {
  getAllNotes(knex) {
    return knex('noteful_notes').select('*');
  },

  getById(knex, note_id) {
    return knex
      .from('noteful_notes')
      .select('*')
      .where({ note_id })
      .first();
  },

  insertNewNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into('noteful_notes')
      .returning('*')
      .then(row => row[0]);
  },

  deleteNote(knex, note_id) {
    return knex('noteful_notes')
      .where({ note_id })
      .delete();
  },

  updateNote(knex, note_id, newNoteName) {
    return knex('noteful_notes')
      .where({ note_id })
      .update(newNoteName);
  }
};

module.exports = NotesService;
