/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("name", "Daily Cup");
    record0.set("price", 100);
    record0.set("description", "Fantasy Football Tournament");
    record0.set("category", "tournaments");
    record0.set("image_url", "https://images.unsplash.com/photo-1702254920341-3aea47e061df");
    record0.set("active", true);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
