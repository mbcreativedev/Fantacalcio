/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("tornei");

  const record0 = new Record(collection);
    record0.set("nome", "Daily Cup");
    record0.set("premio", "\u20ac500");
    record0.set("quota_iscrizione", 5);
    record0.set("posti_totali", 100);
    record0.set("posti_disponibili", 95);
    record0.set("data_inizio", "2026-04-01");
    record0.set("regolamento", "Torneo giornaliero con premi per i top 10");
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("nome", "Weekly Cup");
    record1.set("premio", "\u20ac2000");
    record1.set("quota_iscrizione", 10);
    record1.set("posti_totali", 200);
    record1.set("posti_disponibili", 180);
    record1.set("data_inizio", "2026-04-07");
    record1.set("regolamento", "Torneo settimanale con premi per i top 20");
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("nome", "Monthly Cup");
    record2.set("premio", "\u20ac10000");
    record2.set("quota_iscrizione", 20);
    record2.set("posti_totali", 500);
    record2.set("posti_disponibili", 450);
    record2.set("data_inizio", "2026-05-01");
    record2.set("regolamento", "Torneo mensile con premi per i top 50");
  try {
    app.save(record2);
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
