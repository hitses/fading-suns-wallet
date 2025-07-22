import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'FadingSunsWalletDB',
  version: 3,
  objectStoresMeta: [
    {
      store: 'characters',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'slug', keypath: 'slug', options: { unique: true } },
      ],
    },
  ],
};
