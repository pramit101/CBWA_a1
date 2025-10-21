import db from '../../../app/models';
const { EscapeRoom } = db;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json({ error: 'Session ID required' }, { status: 400 });
    }

    const escapeRoom = await EscapeRoom.findByPk(sessionId);
    
    if (!escapeRoom) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Parse JSON fields back to objects/arrays
    return Response.json({
      id: escapeRoom.id,
      roomIndex: escapeRoom.roomIndex,
      layerCount: escapeRoom.layerCount,
      timerMinutes: escapeRoom.timerMinutes,
      layers: JSON.parse(escapeRoom.layers || '[]'),
      keypadCode: escapeRoom.keypadCode,
      hint: escapeRoom.hint,
      quizUnlock: escapeRoom.quizUnlock,
      helpContent: escapeRoom.helpContent,
      quiz: JSON.parse(escapeRoom.quiz || '[]'),
      h1: escapeRoom.h1,
      h2: escapeRoom.h2,
      h3: escapeRoom.h3,
      hiddenQuestion: escapeRoom.hiddenQuestion,
      hiddenAnswer: escapeRoom.hiddenAnswer,
      sequenceChunks: JSON.parse(escapeRoom.sequenceChunks || '[]')
    });
  } catch (error) {
    console.error('Load error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
