const hateos = {
    getBlogsHateos: (scheme, hostname) => ({
        'self_url': `${scheme}${hostname}/blogs`,
        'blog_url':  `${scheme}${hostname}/blogs/{blog_id}`,
    }),

    getArtcleHateos: (scheme, hostname) => ({
        'self_url': `${scheme}${hostname}/articles`,
        'article_url':  `${scheme}${hostname}/articles/{article_id}`,
    })
}



module.exports = hateos