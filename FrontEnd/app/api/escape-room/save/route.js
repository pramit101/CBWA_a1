const dbModule = require("../../../../models/index"); 
const db = dbModule.default || dbModule; 
const { EscapeRoom } = db;

// 🚩 FIX 1: Initialize the connection globally (only runs once on server start).
const dbReadyPromise = db.connectAndSync().catch(error => {
    console.error("CRITICAL: Database connection failed on startup.", error);
    throw error;
});

export async function POST(request) {
  // 🚩 INSTRUMENTATION: Generate a unique ID for this request for easy tracking in logs
  const requestId = Math.random().toString(36).substring(2, 9);
  
  try {
    await dbReadyPromise;
  } catch (e) {
    console.error(`[${requestId}] DB Connection Failed.`);
    return Response.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    // 🚩 INSTRUMENTATION: Use safer parsing for JMeter compatibility
    const rawBody = await request.text();
    if (!rawBody) {
        console.warn(`[${requestId}] WARN: Empty request body received.`);
        return Response.json({ error: "Request body is empty - JMeter failed to send data." }, { status: 400 });
    }
    
    let body;
    try {
        body = JSON.parse(rawBody);
    } catch(e) {
        console.error(`[${requestId}] JSON Parse Failure: ${e.message}`);
        return Response.json({ error: "JSON Payload is malformed or corrupt.", details: e.message }, { status: 400 });
    }
    
    const {
      sessionId,
      layerCount,
      timerMinutes,
      layers,
      keypadCode,
      hint,
      quizUnlock,
      helpContent,
      quiz,
      h1,
      h2,
      h3,
      hiddenQuestion,
      hiddenAnswer,
      sequenceChunks,
    } = body;
    
    // 🚩 CRITICAL FIX: Reject updates during load test (where JMeter sends no sessionId)
    if (sessionId) {
        // If sessionId is present, proceed with the original UPDATE logic
        
        // 1. Update existing session
        let escapeRoom = await EscapeRoom.findByPk(sessionId);
        
        if (!escapeRoom) {
            console.warn(`[${requestId}] Session not found for update: ID ${sessionId}`);
            return Response.json({ error: `Session ID ${sessionId} not found` }, { status: 404 });
        }
        
        console.log(`[${requestId}] Attempting session update: ID ${sessionId}`);

        await escapeRoom.update({
            layerCount, timerMinutes, layers: layers, keypadCode, hint, quizUnlock, helpContent,
            quiz: quiz, h1: h1, h2: h2, h3: h3, hiddenQuestion, hiddenAnswer, sequenceChunks: sequenceChunks,
        });

        return Response.json({
            id: escapeRoom.id,
            message: "Updated successfully",
            data: escapeRoom.toJSON() 
        }, { status: 200 });
    } else {
      // 2. Create new session (FOR LOAD TESTING)
      
      if (!layers || !Array.isArray(layers)) {
          console.error(`[${requestId}] Validation Error: Invalid layers array on CREATE.`);
          return Response.json({ error: "Invalid or missing 'layers' data." }, { status: 400 });
      }

      console.log(`[${requestId}] Attempting new session creation...`);
      
      const escapeRoom = await EscapeRoom.create({
        layerCount, timerMinutes, layers: layers, keypadCode, hint, quizUnlock, helpContent,
        quiz: quiz, h1: h1, h2: h2, h3: h3, hiddenQuestion,
        hiddenAnswer, sequenceChunks: sequenceChunks, // Note: HQ and chunks were fixed to use variable names
      });

      console.log(`[${requestId}] SUCCESS: Created ID ${escapeRoom.id}`);

      return Response.json({
        id: escapeRoom.id,
        message: "Created successfully",
        data: escapeRoom.toJSON() 
      }, { status: 201 });
    }

  } catch (error) {
    // 🚩 INSTRUMENTATION: Log the specific Sequelize error message
    console.error(`[${requestId}] ❌ DATABASE ERROR:`, error.name, error.message);
    
    // Provide explicit error details for common load test failure modes
    let details = error.message;
    if (error.name === 'SequelizeUniqueConstraintError') {
        details = 'A unique constraint error occurred. Ensure no two requests are trying to create the same resource identifier.';
    } else if (error.name === 'SequelizeConnectionAcquireTimeoutError') {
        details = 'Connection pool exhausted. The database is overwhelmed or pool size needs increasing.';
    }

    return Response.json({ 
        error: "Server encountered an internal error during save operation.", 
        details: details 
    }, { status: 500 });
  }
}
