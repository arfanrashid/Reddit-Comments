const mongoose = require('mongoose');
const Topic = mongoose.model('Topic');
const io = require('socket.io')();

io.on('connection', (socket) => 
{
  console.log("Connected to Socket!!"+ socket.id);
  // Receiving topic from client
  socket.on('update', (ctx) => {
    console.log('socketData: '+JSON.stringify(ctx.request.topic));
    module.exports.update(ctx);
  });
});



module.exports.asParameter = async function(topicId, ctx, next) {
  try {
    let topic = await Topic.findOne({
      _id: topicId,
    });


    if(!topic) return;
    if(!ctx.parameters) {
      ctx.parameters = {};
    }
    ctx.parameters.topic = topic;

    return next();
  } catch(e) {
    if(e instanceof mongoose.Error.CastError) {
      return;
    }
    throw e;
  }
};

module.exports.one = async function(ctx) {
  ctx.body = {
    topic: ctx.parameters.topic,
  };
};

module.exports.all = async function(ctx) {
  ctx.body = {
    topics: await Topic.find().sort({upvotes:-1}).sort({downvotes:1}),
  };
};

module.exports.create = async function(ctx) {
  try {
    ctx.body = {
      success: true,
      topic: await new Topic(ctx.request.body).save(),
    };
  } catch(e) {
    if(e instanceof mongoose.Error.ValidationError) {
      ctx.body = {
        success: false,
        errors: e.errors,
      };
    } else {
      throw e;
    }
  }
};
 

module.exports.update = async function(ctx) {
  try {
    ctx.parameters.topic.set(ctx.request.body);
    ctx.body = {
      success: true,
      topic: await ctx.parameters.topic.save(),
    };
    io.emit('TopicUpdated',  ctx.parameters.topic);
  } catch(e) {
    if(e instanceof mongoose.Error.ValidationError) {
      ctx.body = {
        success: false,
        errors: e.errors,
      };
    } else {
      throw e;
    }
  }
};