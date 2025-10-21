import db from '../../../app/models';
const { EscapeRoom } = db;

export async function POST(request) {
  try {
    const {
      sessionId,
      roomIndex,
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
      sequenceChunks
    } = await request.json();

    let escapeRoom;

    if (sessionId) {
      // Update existing session
      escapeRoom = await EscapeRoom.findByPk(sessionId);
      
      if (!escapeRoom) {
        return Response.json({ error: 'Session not found' }, { status: 404 });
      }

      await escapeRoom.update({
        roomIndex,
        layerCount,
        timerMinutes,
        layers: JSON.stringify(layers),
        keypadCode,
        hint,
        quizUnlock,
        helpContent,
        quiz: JSON.stringify(quiz),
        h1,
        h2,
        h3,
        hiddenQuestion,
        hiddenAnswer,
        sequenceChunks: JSON.stringify(sequenceChunks)
      });

      return Response.json({ 
        id: escapeRoom.id, 
        message: 'Updated successfully' 
      });
    } else {
      // Create new session
      escapeRoom = await EscapeRoom.create({
        roomIndex,
        layerCount,
        timerMinutes,
        layers: JSON.stringify(layers),
        keypadCode,
        hint,
        quizUnlock,
        helpContent,
        quiz: JSON.stringify(quiz),
        h1,
        h2,
        h3,
        hiddenQuestion,
        hiddenAnswer,
        sequenceChunks: JSON.stringify(sequenceChunks)
      });

      return Response.json({ 
        id: escapeRoom.id, 
        message: 'Created successfully' 
      });
    }
  } catch (error) {
    console.error('Save error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}