// Require the framework
import Fastify from "fastify";

const app = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
app.register(import("./app"));
