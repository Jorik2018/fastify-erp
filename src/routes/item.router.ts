import { FastifyInstance } from 'fastify'
import { createClient } from "@libsql/client";

async function itemRouter(fastify: FastifyInstance) {

    const turso = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });

    const TABLE = 'products';

    fastify.post('', async (request, reply) => {
        const { name, price }: any = request.body;
        return turso.batch(
            [
                {
                    sql: `INSERT INTO ${TABLE}(name, price) VALUES (?,?)`,
                    args: [name, price],
                },
            ],
            "write",
        ).then(([data]) => reply.status(201).send('' + data.lastInsertRowid))
            .catch(e => reply.status(404).send({ message: e.message }));
    });

    fastify.get('', (request, reply) => {
        return turso.execute(`SELECT * FROM ${TABLE}`).then(({ rows: data }) => reply.send({ data }));
    });

    fastify.get('/:id', (request, reply) => {
        const { id }: any = request.params;
        return turso.execute({
            sql: `SELECT * FROM ${TABLE} WHERE id = ?`,
            args: [id],
        }).then(({ rows: data }) => reply.send(data[0]))

    });

    fastify.put('/:id', (request, reply) => {
        const { id }: any = request.params;
        const { name }: any = request.body;
        return turso.batch(
            [
                [`UPDATE ${TABLE} SET name=? WHERE id=?`, [name, id]],
            ],
            "write",
        ).then(result => reply.send(result))
    });

    fastify.delete('/:id', (request, reply) => {
        const { id }: any = request.params;
        return turso.transaction("write").then(transaction => {
            return transaction.execute({
                sql: `DELETE FROM ${TABLE} WHERE id = ?`,
                args: [id],
            }).then(({ rowsAffected }) => {
                transaction.commit();
                return { rowsAffected };
            }).catch(e => transaction.rollback());
        })
            .then(result => reply.send(result))
            .catch(e => reply.status(404).send(e));
    });

}

export default itemRouter
