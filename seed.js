/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var Thread = mongoose.model('Thread');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

var wipeCollections = function () {
    var removeUsers = User.remove({});
    return Promise.all([
        User.remove({}),
        Post.remove({}),
        Thread.remove({})
    ]);
};

var seedUsers = function () {

    var users = [
        {
            firstName: 'Iris',
            lastName: 'Chang',
            email: 'iris@gmail.com',
            password: '123'
        },
        {
            firstName: 'Dane',
            lastName: 'Tomseth',
            email: 'dane@gmail.com',
            password: '123'
        },
        {
            firstName: 'Justin',
            lastName: 'Isaf',
            email: 'justin@gmail.com',
            password: '123'
        }
    ];

    return User.create(users);

};

var seedThreads = function() {
    return Thread.create({
        subject: 'Testing'
    })
}

var seedPosts = function () {

    var posts = [
        {
            author: '572bc2ce622bf610ef91d347',
            title: 'First post by Iris',
            content: 'Cupcake ipsum dolor sit. Amet sweet roll liquorice bear claw biscuit chocolate bar tart lollipop. Marshmallow tootsie roll ice cream gummies. Fruitcake chocolate bar cookie muffin marshmallow jelly-o. Bear claw bear claw gummi bears. Candy canes sugar plum croissant lollipop muffin. Apple pie tiramisu sugar plum brownie. Tiramisu toffee bonbon fruitcake dragée candy canes chocolate cake. Bear claw caramels jelly gingerbread cheesecake. Cotton candy halvah dessert lemon drops topping. Soufflé lollipop marshmallow chocolate cake. Brownie soufflé cookie sugar plum lollipop carrot cake candy canes.',
            threadId: "572bc24e0c7eaadfeec7414a"
        },
        {
            author: '572bc2ce622bf610ef91d348',
            title: 'First post by Dane',
            content: 'Cake bonbon cake cake wafer halvah pie powder marzipan. Powder dragée danish cookie sesame snaps croissant. Toffee chupa chups pastry caramels powder powder fruitcake cotton candy. Muffin soufflé gummies tart lollipop sesame snaps jelly beans. Pie tootsie roll tiramisu soufflé pastry candy canes. Ice cream jujubes donut chupa chups. Sesame snaps soufflé bonbon biscuit cake gummies powder muffin. Icing caramels brownie marzipan. Candy canes gummi bears chocolate bar oat cake oat cake sugar plum chupa chups lollipop. Tootsie roll pudding candy canes chocolate cake sugar plum gummi bears. Pudding sugar plum gummi bears. Chocolate carrot cake dragée candy canes dessert liquorice croissant. Sweet roll jujubes bonbon chocolate bar marzipan pastry lemon drops.',
            threadId: "572bc24e0c7eaadfeec7414a"
        },
        {
            author: "572bc2ce622bf610ef91d349",
            title: 'First post by Justin',
            content: 'Ice cream jelly beans pastry pudding marzipan chocolate dragée jelly beans. Ice cream bonbon cupcake chupa chups pastry cheesecake danish. Lemon drops brownie gingerbread cupcake sweet roll fruitcake croissant pie. Cupcake powder brownie liquorice gummies gingerbread cake biscuit chocolate. Chocolate bar jelly brownie carrot cake soufflé biscuit jelly-o dragée. Fruitcake candy canes marzipan jujubes bear claw dragée lemon drops. Topping tiramisu macaroon donut tart icing apple pie caramels chupa chups. Sesame snaps ice cream caramels jelly chocolate cake pie jelly beans jelly-o. Cake donut lemon drops pastry pudding. Oat cake dragée soufflé icing gingerbread marzipan marshmallow topping. Gummi bears pie jelly-o tiramisu powder marshmallow. Toffee halvah cake tart croissant liquorice topping brownie.',
            threadId: "572bc24e0c7eaadfeec7414a"
        },
        {
            author: '572bc2ce622bf610ef91d347',
            title: 'Another post by Iris',
            content: 'Apple pie sugar plum croissant. Sweet icing sesame snaps ice cream pudding cheesecake cake cake sweet. Marzipan jelly beans tiramisu topping apple pie. Halvah jelly candy canes fruitcake gummies sugar plum jelly-o candy canes. Macaroon oat cake macaroon jelly-o sweet. Lollipop liquorice soufflé gummi bears tiramisu. Gummi bears sesame snaps croissant biscuit cookie sweet cookie sweet jujubes. Brownie marzipan gummies jelly-o lemon drops halvah jelly-o gummies powder. Cookie cupcake pudding gingerbread sugar plum chupa chups sweet. Danish gummies gummi bears pie lollipop lemon drops lollipop bonbon cake. Danish tiramisu cupcake carrot cake gingerbread powder cupcake donut liquorice. Lollipop dessert jelly lemon drops pastry.',
            threadId: "572bc24e0c7eaadfeec7414a"
        },
        {
            author: '572bc2ce622bf610ef91d348',
            title: 'Another post by Dane',
            content: 'Macaroon muffin apple pie. Macaroon carrot cake bear claw lemon drops candy canes candy gummies topping. Chocolate muffin icing topping bonbon. Biscuit muffin gummi bears carrot cake ice cream tootsie roll sweet chocolate. Biscuit powder oat cake toffee oat cake jelly-o cookie. Croissant jujubes ice cream sesame snaps bonbon candy tiramisu. Biscuit pie cake gingerbread candy jelly-o chocolate cake. Lemon drops dessert candy. Gummi bears fruitcake ice cream. Wafer danish jelly-o cotton candy. Muffin brownie marzipan tootsie roll bear claw. Lollipop jelly-o dessert oat cake liquorice ice cream. Sweet roll marzipan dragée chupa chups brownie chocolate bar jelly beans tart.',
            threadId: "572bc24e0c7eaadfeec7414a"
        }
    ];
    return Post.create(posts);
};

connectToDb
    // .then(function () {
    //     return wipeCollections();
    // })
    // .then(function () {
    //     return seedThreads();
    // })
    // .then(function () {
    //     return seedUsers();
    // })
    .then(function () {
        return seedPosts();
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
