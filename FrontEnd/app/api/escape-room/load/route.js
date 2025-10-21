const dbModule = require("../../../../models/index"); 
const db = dbModule.default || dbModule; 
const { EscapeRoom } = db;

// 🚩 FIX: Initialize the connection globally (only runs once on server start).
const dbReadyPromise = db.connectAndSync().catch(error => {
    console.error("CRITICAL: Database connection failed on startup.", error);
    throw error;
});

export async function GET(request) {
  // 🚩 INSTRUMENTATION: Generate a unique ID for this request
  const requestId = Math.random().toString(36).substring(2, 9);
  
  try {
    await dbReadyPromise;
  } catch (e) {
    console.error(`[${requestId}] DB Connection Failed.`);
    return Response.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    
    console.log(`[${requestId}] Attempting load for Session ID: ${sessionId}`);

    if (!sessionId) {
      console.warn(`[${requestId}] Load Error: Missing Session ID.`);
      return Response.json({ error: "Session ID required" }, { status: 400 });
    }

    const escapeRoom = await EscapeRoom.findByPk(sessionId);

    if (!escapeRoom) {
      console.warn(`[${requestId}] Load Error: Session not found.`);
      return Response.json({ error: "Session not found" }, { status: 404 });
    }
    
    console.log(`[${requestId}] SUCCESS: Loaded Session ID ${sessionId}`);

    // Return the data directly
    return Response.json(escapeRoom.toJSON());

  } catch (error) {
    // 🚩 INSTRUMENTATION: Log the specific error
    console.error(`[${requestId}] ❌ LOAD DATABASE ERROR:`, error.name, error.message);
    return Response.json({ error: "Server encountered an internal error during load operation.", details: error.message }, { status: 500 });
  }
}
