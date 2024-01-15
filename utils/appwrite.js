import { Client, Account, Databases} from 'appwrite';
const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6595be24c80a8d6fba2c');
export const account = new Account(client);

export const databases = new Databases(client);
export { ID } from 'appwrite';