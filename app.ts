// eslint-disable-next-line
require("dotenv").config()
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { makeExecutableSchema } from "@graphql-tools/schema"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const typeDefs = `
  type File {
    id: String!
    name: String!
    directoryId: String!
    versions: [FileVersion]!
    createdAt: String!
    updatedAt: String!
  }

  type FileVersion {
    id: String!
    name: String!
    mimeType: String!
    size: Int!
    fileId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Directory {
    id: String!
    name: String!
    parentId: String!
    createdAt: String!
    updatedAt: String!
    files: [File]!
    directories: [Directory]!
  }

  type Query {
    getAllFiles: [File]!
    getAllFileVersions: [FileVersion]!
    getAllDirectories: [Directory]!
  }
`
const resolvers = {
  Query: {
    getAllFiles: () => {
      return prisma.file.findMany()
    },
    getAllFileVersions: () => {
      return prisma.fileVersion.findMany()
    },
    getAllDirectories: () => {
      return prisma.directory.findMany()
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const port = 3000
console.log(process.env.NODE_ENV)
app.use(
  "/graphql",
  //graphqlHTTP是grapql的http服务，用于处理graphql的查询请求，它接收一个options参数，
  graphqlHTTP({
    // schema是一个 `GraphQLSchema`实例，
    schema,
    // graphiql设置为true可以在浏览器中直接对graphQL进行调试，一般在开发环境中设置为True
    graphiql: process.env.NODE_ENV === "development",
  })
)

app.listen(port, () => {
  console.log(`Application running on port ${port}.`)
})
