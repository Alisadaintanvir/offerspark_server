type KeyType =
  | "TRANSACTION"
  | "NOTIFICATION"
  | "SUBSCRIPTION"
  | "SESSION"
  | "ANALYTICS"
  | "USER"
  | "ROLE"
  | "SUPPORT";
type SubKeysType = "CREATE" | "READ" | "UPDATE" | "DELETE";

export type PermissionsType = {
  [key in KeyType]: {
    [subKey in SubKeysType]: string;
  };
};

export const PERMISSIONS: PermissionsType = {
  TRANSACTION: {
    CREATE: "101",
    READ: "102",
    UPDATE: "103",
    DELETE: "104",
  },
  NOTIFICATION: {
    CREATE: "111",
    READ: "112",
    UPDATE: "113",
    DELETE: "114",
  },
  SUBSCRIPTION: {
    CREATE: "121",
    READ: "122",
    UPDATE: "123",
    DELETE: "124",
  },
  SESSION: {
    CREATE: "131",
    READ: "132",
    UPDATE: "133",
    DELETE: "134",
  },
  ANALYTICS: {
    CREATE: "141",
    READ: "142",
    UPDATE: "143",
    DELETE: "144",
  },
  USER: {
    CREATE: "151",
    READ: "152",
    UPDATE: "153",
    DELETE: "154",
  },
  ROLE: {
    CREATE: "161",
    READ: "162",
    UPDATE: "163",
    DELETE: "164",
  },
  SUPPORT: {
    CREATE: "171",
    READ: "172",
    UPDATE: "173",
    DELETE: "174",
  },
};
