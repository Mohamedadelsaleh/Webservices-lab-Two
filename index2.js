const { ApolloServer, gql } = require('apollo-server');

/* Static users */

let users = [
    {   
        id: 1, 
        firstName: 'Mohamed', 
        lastName: 'Adel', 
        email: 'mohamedadel@gmail.com', 
        isSuspended: false, 
        dob: '24-10-1994'
    },

    {
        id: 2, 
        firstName: 'Abanoub', 
        lastName: 'Kamel',
        email: 'abanoub@yahoo.com', 
        isSuspended: false, 
        dob: '28-10-1997'
    },

    {
        id: 3, 
        firstName: 'Mina', 
        lastName: 'Kameel',
        email: 'mina@hotmail.com', 
        isSuspended: true, 
        dob: '03-09-1995'
    },

    {
        id: 4, 
        firstName: 'Ahmed', 
        lastName: 'Kholy',
        email: 'ahmed@hotmail.com', 
        isSuspended: false, 
        dob: '18-01-1998'
    }

];

/* Static comments */

let comments = [
    {
        id: 1,
        content: "Comment 1",
        user: users[1],
        date: '05-5-2002'
    },

    {
        id: 2,
        content: "Comment 2",
        user: users[2],
        date: '09-11-2014'
    },

    {
        id: 3,
        content: "Comment 3",
        user: users[3],
        date: '19-5-2012'
    },


];

/* Static articles */

let articles = [
    {
        id: 1, 
        title: 'article1',
        body: 'Hello There', 
        date: '25-5-2014',
        author: users[1], 
        comments: [comments[0]]
    },
    {
        id: 2, 
        title: 'article2',
        body: 'Hello There 2', 
        date: '25-5-2014',
        author: users[0], 
        comments: [comments[0]]
    },
    {
        id: 3, 
        title: 'article3',
        body: 'Hello There 3', 
        date: '25-5-2014',
        author: users[0], 
        comments: [comments[0]]
    }

];


const Schema = `
    type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
        isSuspended: Boolean
        dob: String
    }

    type Comment {
        id: ID!
        user: User
        content: String
        date: String
    }

    type Article {
        id: ID!
        title: String
        body: String
        comments: [Comment]
        author: User!
    }

    type Query {
        Users: [User]
        Articles: [Article]
        Comments: [Comment]
    }

    type Mutation {
        deleteArticle (id: Int): [Article]
        createArticle(id: Int, title: String, 
        body:String,
        author:Int): [Article]
    }

`

const typeDefs = gql(Schema);
const resolvers = {
    Query: {
        Users: () => users,
        Articles: () => articles,
        Comments: () => comments
    },
    Mutation: {
        deleteArticle: (_, { id }) => {
            articles = articles.filter((article) => article.id !== id);
            return articles;
        },
        createArticle: (_, { id, title,
            body,
            author }) => {
            articles.push({
                id,
                title,
                body,
                author: users.filter((user) => user.id === author)[0],
            });
            return articles;
        }
    }
};
const server = new ApolloServer({ typeDefs, resolvers });

server.listen(8989).then(({ url }) => {
    console.log('Server ready at 8989');
});