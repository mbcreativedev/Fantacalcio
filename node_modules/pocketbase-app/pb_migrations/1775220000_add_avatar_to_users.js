/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  const field = new Field({
    "id": "file_avatar_user",
    "name": "profile_avatar",
    "type": "file",
    "required": false,
    "presentable": false,
    "hidden": false,
    "maxSelect": 1,
    "maxSize": 5242880,
    "mimeTypes": ["image/jpeg", "image/png", "image/webp", "image/gif"],
    "thumbs": ["100x100", "300x300"]
  });

  collection.fields.add(field);
  app.save(collection);

  console.log("Campo 'profile_avatar' aggiunto alla collezione users.");
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_");

  const field = collection.fields.getByName("profile_avatar");
  if (field) {
    collection.fields.remove(field);
    app.save(collection);
  }
});