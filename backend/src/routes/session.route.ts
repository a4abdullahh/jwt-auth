import { Router } from 'express';
import { deleteSessionHandler, getSessionsHandler } from '../controllers/session.controller';

const sessionsRoutes = Router();

// prefix: /sessions
sessionsRoutes.get('/', getSessionsHandler);
sessionsRoutes.delete('/:id', deleteSessionHandler);


export default sessionsRoutes;
