/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("classifiche");

  const record0 = new Record(collection);
    const record0_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Daily Cup'");
    if (!record0_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Daily Cup'\""); }
    record0.set("torneo_id", record0_torneo_idLookup.id);
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("posizione", 1);
    record0.set("punti", 150);
    record0.set("squadra", "AC Milan Dream");
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
    const record1_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Daily Cup'");
    if (!record1_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Daily Cup'\""); }
    record1.set("torneo_id", record1_torneo_idLookup.id);
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("posizione", 2);
    record1.set("punti", 145);
    record1.set("squadra", "Juventus Fantasy");
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
    const record2_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Daily Cup'");
    if (!record2_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Daily Cup'\""); }
    record2.set("torneo_id", record2_torneo_idLookup.id);
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record2.set("user_id", record2_user_idLookup.id);
    record2.set("posizione", 3);
    record2.set("punti", 140);
    record2.set("squadra", "Inter Squad");
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    const record3_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Weekly Cup'");
    if (!record3_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Weekly Cup'\""); }
    record3.set("torneo_id", record3_torneo_idLookup.id);
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record3.set("user_id", record3_user_idLookup.id);
    record3.set("posizione", 1);
    record3.set("punti", 155);
    record3.set("squadra", "Roma Legends");
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    const record4_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Weekly Cup'");
    if (!record4_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Weekly Cup'\""); }
    record4.set("torneo_id", record4_torneo_idLookup.id);
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record4.set("user_id", record4_user_idLookup.id);
    record4.set("posizione", 2);
    record4.set("punti", 148);
    record4.set("squadra", "Napoli Stars");
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record5 = new Record(collection);
    const record5_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Weekly Cup'");
    if (!record5_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Weekly Cup'\""); }
    record5.set("torneo_id", record5_torneo_idLookup.id);
    const record5_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record5_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record5.set("user_id", record5_user_idLookup.id);
    record5.set("posizione", 3);
    record5.set("punti", 142);
    record5.set("squadra", "Lazio United");
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    const record6_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Monthly Cup'");
    if (!record6_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Monthly Cup'\""); }
    record6.set("torneo_id", record6_torneo_idLookup.id);
    const record6_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record6_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record6.set("user_id", record6_user_idLookup.id);
    record6.set("posizione", 1);
    record6.set("punti", 160);
    record6.set("squadra", "Fiorentina Elite");
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    const record7_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Monthly Cup'");
    if (!record7_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Monthly Cup'\""); }
    record7.set("torneo_id", record7_torneo_idLookup.id);
    const record7_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record7_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record7.set("user_id", record7_user_idLookup.id);
    record7.set("posizione", 2);
    record7.set("punti", 152);
    record7.set("squadra", "Torino Fighters");
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    const record8_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Monthly Cup'");
    if (!record8_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Monthly Cup'\""); }
    record8.set("torneo_id", record8_torneo_idLookup.id);
    const record8_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record8_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record8.set("user_id", record8_user_idLookup.id);
    record8.set("posizione", 3);
    record8.set("punti", 148);
    record8.set("squadra", "Atalanta Warriors");
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    const record9_torneo_idLookup = app.findFirstRecordByFilter("tornei", "nome='Monthly Cup'");
    if (!record9_torneo_idLookup) { throw new Error("Lookup failed for torneo_id: no record in 'tornei' matching \"nome='Monthly Cup'\""); }
    record9.set("torneo_id", record9_torneo_idLookup.id);
    const record9_user_idLookup = app.findFirstRecordByFilter("users", "email='demo@fanta-lega.com'");
    if (!record9_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='demo@fanta-lega.com'\""); }
    record9.set("user_id", record9_user_idLookup.id);
    record9.set("posizione", 4);
    record9.set("punti", 135);
    record9.set("squadra", "Verona Strikers");
  try {
    app.save(record9);
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
