/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Permetti la visualizzazione pubblica dei profili utente
  // (necessario per la pagina profilo giocatore accessibile dalla classifica)
  collection.viewRule = "";

  // La listRule rimane restrittiva: solo l'utente vede la lista
  // collection.listRule rimane invariato

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("users");

  // Rollback: ripristina la viewRule originale
  collection.viewRule = "id = @request.auth.id";

  return app.save(collection);
});
