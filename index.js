const server = require('./api/server')

const port = 4200;

server.listen(4200, () => console.log(`server running on ${port}`)
)
