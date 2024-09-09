import io from 'socket.io-client';
import { BACKEND_URL } from './constants';

export const socket = io(BACKEND_URL, {
    'forceNew': true,
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax' : 10000,
    'reconnectionAttempts': 50
});