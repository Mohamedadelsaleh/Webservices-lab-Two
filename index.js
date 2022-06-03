const express = require('express');
require('./helpers/dbConnection');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares');
const { User, Comment, Article } = require('./models');
const { getArtcleHateos } = require('./helpers/constants');

const server = express();

server.use(bodyParser.json());

const userRouter = express.Router();
const blogsRouter = express.Router();
const articleRouter = express.Router();
const commentRouter = express.Router();


/*************************** User-Routers ********************** 
* 
* Get all Users
* Create a new User
* Get a specific User
* Get all Articles of a specific user
* Checking if user Suspended or not
*
****************************************************************/

userRouter.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
})


userRouter.post('/', async (req, res, next) => {
    try {
        await User.create(req.body);
        res.send({success: true});
    } catch (err) {
        next(err);
    }
});


userRouter.get('/:user_id', async (req, res, next) => {
    res.header({
        'Content-Type': 'application/json'
    });
    try {
        const user = await User.findById(req.params.user_id);
        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
})


userRouter.get('/:user_id/articles', async (req, res, next) => {

    try {
        const articles = await Article.findById(req.params.user_id)
        .populate('articles')
        .select('articles');
        res.send(articles);
    } catch (error) {
        next(error);
    }
})

userRouter.post('/:userId/suspend', async (req, res, next) => {
    const id = req.params.userId;

    try {
        const result = await User.updateOne(
            {"_id": id}, 
            {$set: {isSuspended: true}});
        if(!result) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});

userRouter.post('/:userId/unSuspend', async (req, res, next) => {
    const id = req.params.userId;

    try {
        const result = await User.updateOne(
                        {"_id": id}, 
                        {$set: {isSuspended: false}});
        if(!result) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});



/******************************************************************/


/*************************** Article-Routers ********************** 
* 
* Get all Articles
* Get a specific Article we can use it in searching 
* Get Author of specific Article
* Create a new Article
* Update a specific Article
* Delete a specific Article
*
*******************************************************************/


articleRouter.get('/', async (req, res) => {
    console.log(req);
    const articleHateos = getArtcleHateos('https://', 'localhost')

    res.status(200).send(articleHateos);
});

articleRouter.get('/articles', async (req, res, next) => {
    try {
        const artcles = await Article.find({});
        res.status(200).send(artcles);
    } catch (error) {
        next(error);
    }
})


articleRouter.get('/:article_id', async (req, res, next) => {
    res.header({
        'Content-Type': 'application/json'
    });
    try {
        const artcle = await Article.findById(req.params.article_id);
        res.status(200).send(artcle);
    } catch (error) {
        next(error);
    }
})

articleRouter.get('/:article_id/comments', async (req, res, next) => {

    try {
        const comments = await Article.findById(req.params.article_id)
        .populate('comments')
        .select('comments');
        res.send(comments);
    } catch (error) {
        next(error);
    }
})


articleRouter.get('/:article_id/author', async (req, res, next) => {

    try {
        const author = await Article.findById(req.params.article_id)
        .populate('author')
        .select('author');
        res.status(200).send(author);
    } catch (error) {
        next(error);
    }
})

articleRouter.post('/', async (req, res, next) => {
    try {
        const articleId = await Article.create(req.body);
        if(!articleId) throw('ERROR');
        res.status(200).send({success: true});
    } catch (err) {
        return next(err);
    }
});

articleRouter.patch('/:articleId', async (req, res, next) => {
    const id = req.params.articleId;
    try {
        const articleId = await Article.updateOne(
            {"_id": id},
            {$set: req.body});

        if(!articleId) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});

articleRouter.delete('/:articleId', async (req, res, next) => {
    const id = req.params.articleId;

    try {
        const articleId = await Article.deleteOne({"_id": id});
        if(!articleId) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});


/******************************************************************/


/*************************** Comment-Routers ********************** 
* 
* Create a new Comment
* Update a specific Comment
* Delete a specific Comment
*
*******************************************************************/



commentRouter.post('/', async (req, res, next) => {
    try {
        const result = await Comment.create(req.body);
        if(!result) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});

commentRouter.patch('/:commentId', async (req, res, next) => {
    const id = req.params.commentId;
    try {
        const result = await Comment.updateOne({"_id": id}, {$set: req.body});
        if(!result) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});

commentRouter.delete('/:commentId', async (req, res, next) => {
    const id = req.params.commentId;

    try {
        const result = await Comment.deleteOne({"_id": id});
        if(!result) throw('ERROR');
        res.send({success: true});
    } catch (err) {
        return next(err);
    }
});

/*****************************************************************************/

userRouter.use('/:user_id/blogs', blogsRouter);

server.use(['user', '/users'], userRouter);
server.use(['/article', '/articles'], articleRouter);
server.use(['/comment', '/comments'], commentRouter);
server.use(errorHandler);

server.listen(3000, 'localhost', () => {
    console.log('server is listening on: 3000');
});