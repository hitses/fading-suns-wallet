import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'FadingSunsWalletDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'characters',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
  ],
};
