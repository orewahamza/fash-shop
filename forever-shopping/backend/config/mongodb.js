import mongoose  from "mongoose";   


const connectDB = async () => {

    mongoose.connection.on('connected',()=>{
        console.log('MongoDB Connected')
    })
    let base = process.env.MONGODB_URL || '';
    // Trim trailing slash ONLY if it's the end of the string and NOT part of the protocol
    // But for mongodb+srv://host/dbname?query, trailing slash might be after query? No.
    // If base ends with /, remove it to simplify appending logic
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    
    // Check if DB name is already in the connection string
    // Standard format: mongodb://host:port/dbname?query or mongodb+srv://host/dbname?query
    // We look for a slash after the host/port section
    
    let uri = base;
    const hasDb = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/i.test(base);
    
    if (!hasDb) {
        // Find query start
        const queryIdx = base.indexOf('?');
        
        if (queryIdx !== -1) {
             const beforeQuery = base.slice(0, queryIdx);
             const afterQuery = base.slice(queryIdx);
             
             if (beforeQuery.endsWith('/')) {
                 uri = beforeQuery + 'e-commerce' + afterQuery;
             } else {
                 uri = beforeQuery + '/e-commerce' + afterQuery;
             }
        } else {
            uri = base.endsWith('/') ? `${base}e-commerce` : `${base}/e-commerce`;
        }
    }
    
    console.log(`Attempting to connect to MongoDB: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(uri)

}

export default connectDB;
