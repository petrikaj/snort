import Dexie, { Table } from "dexie";
import { HexKey, NostrEvent, u256 } from "@snort/system";

export const NAME = "snortDB";
export const VERSION = 13;

export interface SubCache {
  id: string;
  ids: u256[];
  until?: number;
  since?: number;
}

export interface EventInteraction {
  id: u256;
  event: u256;
  by: HexKey;
  reacted: boolean;
  zapped: boolean;
  reposted: boolean;
}

export interface Payment {
  url: string;
  pr: string;
  preimage: string;
  macaroon: string;
}

export interface UnwrappedGift {
  id: string;
  to: string;
  created_at: number;
  inner: NostrEvent;
  tags?: Array<Array<string>>; // some tags extracted
}

const STORES = {
  chats: "++id",
  eventInteraction: "++id",
  payments: "++url",
  gifts: "++id",
  notifications: "++id",
};

export class SnortDB extends Dexie {
  ready = false;
  chats!: Table<NostrEvent>;
  eventInteraction!: Table<EventInteraction>;
  payments!: Table<Payment>;
  gifts!: Table<UnwrappedGift>;
  notifications!: Table<NostrEvent>;

  constructor() {
    super(NAME);
    this.version(VERSION).stores(STORES);
  }

  isAvailable() {
    if ("indexedDB" in window) {
      return new Promise<boolean>(resolve => {
        const req = window.indexedDB.open("dummy", 1);
        req.onsuccess = () => {
          resolve(true);
        };
        req.onerror = () => {
          resolve(false);
        };
      });
    }
    return Promise.resolve(false);
  }
}

export const db = new SnortDB();
