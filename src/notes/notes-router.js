const path = require('path');
const express = require('express');
const xss = require('xss');
const NotesService = require('./notes-service');
const NotesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
  note_id: note.note_id,
  name: xss(note.name),
  folder_id: note.folder_id,
  modified: note.modified,
  content: xss(note.content)
});

NotesRouter.route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.status(200).json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { name, folder_id, content } = req.body;
    const newNote = { name, folder_id, content };

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        });
      }
    }

    NotesService.insertNewNote(knexInstance, newNote).then(note => {
      return res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.note_id}`))
        .json(note);
    });
  });
NotesRouter.route('/:note_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { note_id } = req.params;
    NotesService.getById(knexInstance, note_id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note with id ${note_id} does not exist` }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    return res.status(200).json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { note_id } = req.params;
    NotesService.deleteNote(knexInstance, note_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = NotesRouter;
