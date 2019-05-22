const FoldersService = {
  getAllFolders(knex) {
    return knex('noteful_folders').select('*');
  },

  getById(knex, folder_id) {
    return knex
      .from('noteful_folders')
      .select('*')
      .where({ folder_id })
      .first();
  },

  insertNewFolder(knex, newFolder) {
    return knex
      .insert(newFolder)
      .into('noteful_folders')
      .returning('*')
      .then(row => row[0]);
  },

  deleteFolder(knex, folder_id) {
    return knex('noteful_folders')
      .where({ folder_id })
      .delete();
  },

  updateFolder(knex, folder_id, newFolderName) {
    return knex('noteful_folders')
      .where({ folder_id })
      .update(newFolderName);
  }
};

module.exports = FoldersService;
