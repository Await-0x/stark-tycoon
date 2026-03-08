import { BigNumberish, shortString } from "starknet";

export const stringToFelt = (v: string): BigNumberish =>
  v ? shortString.encodeShortString(v) : "0x0";
