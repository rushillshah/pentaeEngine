import db from "./knex";

async function status() {
  try {
    const [completed, pending] = await db.migrate.list();

    console.log("=== Migration Status ===\n");

    if (completed.length) {
      console.log("Completed:");
      for (const m of completed) {
        const name = typeof m === "string" ? m : (m as { name?: string }).name ?? JSON.stringify(m);
        console.log(`  ✓ ${name}`);
      }
    } else {
      console.log("Completed: (none)");
    }

    console.log();

    if (pending.length) {
      console.log("Pending:");
      for (const m of pending) {
        const name = typeof m === "string" ? m : (m as { file?: string; name?: string }).file ?? (m as { name?: string }).name ?? JSON.stringify(m);
        console.log(`  ○ ${name}`);
      }
    } else {
      console.log("Pending: (none)");
    }
  } catch (err) {
    console.error("Failed to get status:", err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

status();
