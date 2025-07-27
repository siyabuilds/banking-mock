import { BankAccount } from "./bank_account.js";

export const BANK_ERROR_MESSAGES = {
  ACCOUNT_TYPE_EXISTS: "Account type already exists",
  NEGATIVE_INTEREST_RATE: "Interest rate cannot be negative",
  INVALID_ACCOUNT_TYPE: "Invalid account type",
};

const getInterest = (accountType, accountTypes) => {
  for (const type of accountTypes) {
    if (type.accountType === accountType) {
      return type.interestRate;
    }
  }
  throw new Error(BANK_ERROR_MESSAGES.INVALID_ACCOUNT_TYPE);
};

const isAccNumberTaken = (accNumber, accounts) => {
  for (const account of accounts.values()) {
    if (account.accountNumber === accNumber) {
      return true;
    }
  }
  return false;
};

const generateAccNumber = () =>
  Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");

const generateUniqueAccNumber = (accounts) => {
  let accNumber;
  do {
    accNumber = generateAccNumber();
  } while (isAccNumberTaken(accNumber, accounts));
  return accNumber;
};

export class Bank {
  #accounts = new Map();
  #accountTypes = new Set();

  get accounts() {
    return this.#accounts;
  }

  get accountTypes() {
    return this.#accountTypes;
  }

  addAccountType({ accountType, interestRate }) {
    for (const type of this.#accountTypes) {
      if (type.accountType === accountType) {
        throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_TYPE_EXISTS);
      }
    }
    if (interestRate < 0) {
      throw new Error(BANK_ERROR_MESSAGES.NEGATIVE_INTEREST_RATE);
    }
    this.#accountTypes.add({ accountType, interestRate });
  }

  openBankAccount({ accountType }) {
    let accountTypeExists = false;
    for (const type of this.#accountTypes) {
      if (type.accountType === accountType) {
        accountTypeExists = true;
        break;
      }
    }
    if (!accountTypeExists) {
      throw new Error(BANK_ERROR_MESSAGES.INVALID_ACCOUNT_TYPE);
    }
    const accountNumber = generateUniqueAccNumber(this.#accounts);
    const interestRate = getInterest(accountType, this.#accountTypes);
    const account = new BankAccount({
      accountType,
      accountNumber,
      interestRate,
    });
    this.#accounts.set(accountNumber, account);
    return accountNumber;
  }
}
