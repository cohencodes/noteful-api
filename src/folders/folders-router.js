const path = require('path');
const express = require('express');
const FoldersRouter = express.Router();
const xss = require('xss');
const FoldersService = require('./folders-service');
const jsonParser = express.json();

const serializeFolder = folder => ({
  folder_id: folder.folder_id,
  name: xss(folder.name)
});

FoldersRouter.route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.status(200).json(folders);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    if (name === null) {
      return res.status(400).json({
        error: { message: `Folder name is required` }
      });
    }

    const knexInstance = req.app.get('db');
    FoldersService.insertNewFolder(knexInstance, newFolder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.folder_id}`))
          .json(folder);
      })
      .catch(next);
  });

FoldersRouter.route('/:folder_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { folder_id } = req.params;
    FoldersService.getById(knexInstance, folder_id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder with id ${folder_id} does not exist` }
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.status(200).json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { folder_id } = req.params;
    FoldersService.deleteFolder(knexInstance, folder_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const folderToUpdate = { name };

    if (name === null) {
      return res.status(400).json({
        error: {
          message: `Request body must have a name`
        }
      });
    }

    const folder_id = req.params.folder_id;
    const knexInstance = req.app.get('db');
    FoldersService.updateFolder(knexInstance, folder_id, folderToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = FoldersRouter;
