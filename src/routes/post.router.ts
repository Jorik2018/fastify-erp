import { FastifyInstance } from 'fastify'
import { createPostSchema } from '../schema'
import * as controllers from '../controllers'
import { checkValidRequest, checkValidUser } from '../helpers/auth'

async function postRouter(fastify: FastifyInstance) {
    fastify.decorateRequest('authUser', '')
    //fastify.addHook('preHandler', checkValidRequest)
    //fastify.addHook('preHandler', checkValidUser)
    fastify.route({
        method: 'POST',
        url: '',
        schema: createPostSchema,
        preHandler: [checkValidRequest, checkValidUser],
        handler: controllers.createPost
    })
}

export default postRouter
