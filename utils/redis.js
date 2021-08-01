const mongoose = require('mongoose');
const redis    = require('redis');
const util     = require('util');
let   client;
exports.setupRedis = () =>{
    client   = redis.createClient({
        host     : process.env.REDIS_HOST,
        port     : process.env.REDIS_PORT,
        password : process.env.REDIS_SECRET
    });

    client.on('connect', (err, res) => {
        console.log('redis is connected!');
    });

    client.on('error', err => {
        console.log(err);
    });

    client.hget = util.promisify(client.hget);

    const exec = mongoose.Query.prototype.exec;

    mongoose.Query.prototype.cache = function() {
        this.useCache = true;
        this.expire   = 60;
        this.hashKey  = JSON.stringify(this.mongooseCollection.name);
        return this;
    }

    mongoose.Query.prototype.exec = async function() {
        if (!this.useCache) {
          return await exec.apply(this, arguments);
        }
    
        const keyBase = this.getQuery()._id;
        const collectionName = this.mongooseCollection.name;
    
      
        const key = JSON.stringify({
          key : keyBase,
          collection: collectionName
        });
    
        const cacheValue = await client.hget(this.hashKey, key);
        if (!cacheValue) {
          const result = await exec.apply(this, arguments);
          client.hset(this.hashKey, key, JSON.stringify(result));
          client.expire(this.hashKey, this.expire);
      
          console.log('Return data from MongoDB');
          return result;
        }
      
        const doc = JSON.parse(cacheValue);
        console.log('Return data from Redis');
        return Array.isArray(doc)
          ? doc.map(d => new this.model(d))
          : new this.model(doc);
    };
}

const getRedisClient   = () => {
    
}

exports.clearRedisCache = (hashKey,id) => {
    const key = JSON.stringify({
        key : id,
        collection: hashKey
    });
    hashKey = JSON.stringify(hashKey)
    console.log("clearing  key from "  + hashKey + "  key : " + key)
    client.hdel(hashKey,key,(err,result) =>{
      console.log("cache cleared")
    });
  
}