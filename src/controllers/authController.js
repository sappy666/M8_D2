import jwt from 'jsonwebtoken';
import { agents } from '../models/agentModel.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const authenticateAgent = (req, res) => {
    const { email, password } = req.body;
    const agent = agents.find(a => a.email === email && a.password === password);

    if (!agent) {
        return res.status(401).send('Credenciales inválidas');
    }

    const token = jwt.sign({ email: agent.email, name: agent.name }, process.env.JWT_SECRET, { expiresIn: '2m' });
    res.json({ token: token, name: agent.name, email: agent.email });
};



export const getRestrictedPage = (req, res) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('No authorization header');
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
        res.sendFile(path.join(__dirname, '..', '..', 'views', 'dashboard.html'));
    } catch (error) {
        res.status(401).send('Acceso denegado: ' + error.message);
    }
};


export const get404 = (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', '..', 'views', '404.html'));
}
