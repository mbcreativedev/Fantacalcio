/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3763274749");

  const field = new Field({
    "id": "url_immagine_torneo",
    "name": "immagine",
    "type": "url",
    "required": false,
    "presentable": false,
    "hidden": false,
    "exceptDomains": [],
    "onlyDomains": []
  });

  collection.fields.add(field);
  app.save(collection);

  console.log("Campo 'immagine' aggiunto alla collezione tornei.");
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3763274749");
  const field = collection.fields.getByName("immagine");
  if (field) {
    collection.fields.remove(field);
    app.save(collection);
  }
});
