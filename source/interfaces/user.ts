import { Document } from 'mongoose';

// build an interface to keep track on the data type when
// grading data and inserting data
export default interface IUser extends Document {
    username: string;
    password: string;
}
