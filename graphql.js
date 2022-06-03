const { ApolloServer, gql } = require('apollo-server');

let users = [
    { id: 1, name: 'ahmed', friends: [] },
    { id: 2, name: 'mohamed', friends: [] },
    { id: 3, name: 'mahmoud', friends: [] },
    { id: 4, name: 'islam', friends: [] },
];

const schema = `
    type User {
        id: ID!
        name: String!
        age: Int
        balance: Float
        is_active: Boolean
        friends: [User]!
        homepage: String
        email: String
    }

    type Post {
        id: ID!
        title: String!
    }

    type Query {
        allUsers (last: Int): [User]
        allPosts: [Post]
        user (name: String!): User
    }

    type Mutation {
        deleteUser (id: ID): [User]
    }
`

const typeDefs = gql(schema);

const resolvers = {
    Query: {
        allUsers: (_, { last }) => {
            // const length = users.length;
            if (!last) return users;
            if (last) return users.slice(last);
        },
        allPosts: () => [{ id: 22, title: '111' }],
        user: (_, { name }) => {
            return users.find((user) => user.name === name);
        },
    },
    Mutation: {
        deleteUser: (_, { id }) => {
            users = users.filter((user) => user.id !== id);
            return users;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4001).then(({ url }) => { console.log('url: ', url) });


// root types

// Query <- entry point for query
// Mutation <- entry point for mutation
// Subscription <- push & pull websockets ??