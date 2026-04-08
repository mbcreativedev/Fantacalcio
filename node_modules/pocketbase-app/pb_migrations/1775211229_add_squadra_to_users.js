/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Add squadra field
  collection.fields.add(new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text_squadra_fantacalcio",
    "max": 0,
    "min": 0,
    "name": "squadra",
    "pattern": "",
    "presentable": true,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }));

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Remove squadra field on rollback
  collection.fields.removeById("text_squadra_fantacalcio");

  return app.save(collection);
});
