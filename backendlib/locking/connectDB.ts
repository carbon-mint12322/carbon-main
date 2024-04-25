import { connect } from '~/backendlib/upload/file';

async function connectDB() {
    const db = await connect();
    return db;
};

export default connectDB;

