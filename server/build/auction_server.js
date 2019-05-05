"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var app = express();
var server = app.listen(8000, 'localhost', function () {
    console.log('服务器已启动，地址是:http://localhost:8000');
});
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '衣服', 25, 3.5, '淡蓝色素衣裹身，淡蓝色素衣裹身,淡蓝色素衣裹身,外披白色纱衣，露出线条优美的', ['穿戴', '居家']),
    new Product(2, '手表', 784, 1.5, '法国总统夫人之选 法国总统夫人之选法国总统夫人之选法国优雅时尚腕表品牌', ['穿戴', '高贵']),
    new Product(3, '香水', 432, 2.0, '芭莎丽人奇迹香水女持久淡香持久淡香持久淡香学生自然清新抖音网红少女香', ['奢华', '高贵']),
    new Product(4, '围城', 34, 3.5, '围城故事发生于1920。迫于家庭压力迫于家庭压力与同乡周家女子订亲。', ['书籍', '涵养']),
    new Product(5, '手机', 54, 2.5, '畅玩7全网通4G智能手机7C/7A大屏大字畅玩7全网学生老学生老通学生老人机', ['电子产品', '通话']),
    new Product(6, '电脑', 3544, 5.0, '水冷吃鸡主机工作室多开高配游脑台式机全戏型diy组装电脑台式机全套', ['电子产品', '办公'])
];
var comments = [
    new Comment(1, 1, '2018/2/3 上午10:45:54', '郭圆圆', 3, '东西不错，老公很喜欢'),
    new Comment(2, 1, '2018/2/3 上午10:45:54', '王曾祺', 5, '挺好的'),
    new Comment(3, 1, '2018/2/3 上午10:45:54', '刘天一', 4, '一般般吧，性价比很高了'),
    new Comment(4, 2, '2018/2/3 上午10:45:54', '王二', 4, '还好啦'),
    new Comment(5, 3, '2018/2/3 上午10:45:54', '张三', 3, '挺不错'),
    new Comment(6, 4, '2018/2/3 上午10:45:54', '古天乐', 1.5, '收到啦，非常好'),
    new Comment(7, 6, '2018/2/3 上午10:45:54', '刘亦菲', 3, '哈哈'),
    new Comment(8, 5, '2018/2/3 上午10:45:54', '老屈', 4.5, '好'),
    new Comment(9, 4, '2018/2/3 上午10:45:54', '海露', 2, '差评'),
    new Comment(10, 5, '2018/2/3 上午10:45:54', '柳依依', 4, '垃圾东西'),
    new Comment(11, 3, '2018/2/3 上午10:45:54', '梁飞', 3.5, '垃圾东西'),
    new Comment(12, 4, '2018/2/3 上午10:45:54', '孙艺', 0.5, '垃圾东西'),
    new Comment(13, 5, '2018/2/3 上午10:45:54', '刘涛', 2, '垃圾东西'),
];
app.use('/', express.static(path.join(__dirname, '..', 'clientCompiled')));
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (Object.keys(params).length !== 0) {
        if (params.title) {
            result = result.filter(function (p) {
                return p.title.indexOf(params.title) != -1;
            });
        }
        if (params.price && result.length > 0) {
            result = result.filter(function (p) {
                return p.price <= parseInt(params.price);
            });
        }
        console.log(result);
        if (params.category !== "-1" && result.length > 0) {
            result = result.filter(function (p) {
                return p.categories.indexOf(params.category) != -1;
            });
        }
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var subscription = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.on("message", function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscription.get(websocket) || [];
        subscription.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscription.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscription.delete(ws);
        }
    });
}, 2000);
