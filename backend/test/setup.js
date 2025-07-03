import dotenv from 'dotenv';
import { beforeAll, afterAll } from 'vitest';
import db from '../src/models';


dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

beforeAll(async () => {
    try {
        await db.sequelize.authenticate();

    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await db.sequelize.close();
    } catch (error) {
        console.error('❌ Error al cerrar la conexión de la base de datos:', error);
    }
});
