import { BankAccount } from "./bank_account.js";
import Decimal from "decimal.js";

export const BANK_ERROR_MESSAGES = {
  ACCOUNT_TYPE_EXISTS: "Account type already exists",
  NEGATIVE_INTEREST_RATE: "Interest rate cannot be negative",
  INVALID_ACCOUNT_TYPE: "Invalid account type",
  ACCOUNT_NOT_FOUND: "Account not found",
  INVALID_AMOUNT: (operation) =>
    `Invalid amount for ${operation}: must be a positive number`,
  EXCEEDS_BALANCE: "Amount exceeds available balance",
};

const getInterest = (accountType, accountTypes) => {
  const typeObj = accountTypes.find((type) => type.accountType === accountType);
  if (typeObj) {
    return typeObj.interestRate;
  }
  throw new Error(BANK_ERROR_MESSAGES.INVALID_ACCOUNT_TYPE);
};

const isAccNumberTaken = (accNumber, accounts) => {
  return accounts.some((account) => account.accountNumber === accNumber);
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

const retrieveAccount = (accountNumber, accounts) => {
  return accounts.find((acc) => acc.accountNumber === accountNumber);
};

export class Bank {
  #accounts = [];
  #accountTypes = [];

  get accounts() {
    return this.#accounts;
  }

  get accountTypes() {
    return this.#accountTypes;
  }

  addAccountType({ accountType, interestRate }) {
    if (this.#accountTypes.some((type) => type.accountType === accountType)) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_TYPE_EXISTS);
    }
    if (interestRate < 0) {
      throw new Error(BANK_ERROR_MESSAGES.NEGATIVE_INTEREST_RATE);
    }
    this.#accountTypes.push({ accountType, interestRate });
  }

  openBankAccount({ accountType }) {
    const typeObj = this.#accountTypes.find(
      (type) => type.accountType === accountType
    );
    if (!typeObj) {
      throw new Error(BANK_ERROR_MESSAGES.INVALID_ACCOUNT_TYPE);
    }
    const accountNumber = generateUniqueAccNumber(this.#accounts);
    const interestRate = typeObj.interestRate;
    const account = new BankAccount({
      accountType,
      accountNumber,
      interestRate,
    });
    this.#accounts.push(account);
    return accountNumber;
  }

  deposit({ accountNumber, amount }) {
    const account = retrieveAccount(accountNumber, this.#accounts);
    if (!account) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const decimalAmount = new Decimal(amount);

    if (decimalAmount.lte(0)) {
      throw new Error(BANK_ERROR_MESSAGES.INVALID_AMOUNT("deposit"));
    }

    account.deposit({ amount: decimalAmount.toNumber() });
  }

  withdraw({ accountNumber, amount }) {
    const account = retrieveAccount(accountNumber, this.#accounts);
    if (!account) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const decimalAmount = new Decimal(amount);

    if (decimalAmount.lte(0)) {
      throw new Error(BANK_ERROR_MESSAGES.INVALID_AMOUNT("withdrawal"));
    }

    if (decimalAmount.gt(new Decimal(account.getBalance()))) {
      throw new Error(BANK_ERROR_MESSAGES.EXCEEDS_BALANCE);
    }

    account.withdraw({ amount: decimalAmount.toNumber() });
  }

  transfer({ fromAccountNumber, toAccountNumber, amount }) {
    const fromAccount = retrieveAccount(fromAccountNumber, this.#accounts);
    const toAccount = retrieveAccount(toAccountNumber, this.#accounts);

    if (!fromAccount || !toAccount) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }

    const decimalAmount = new Decimal(amount);

    if (decimalAmount.lte(0)) {
      throw new Error(BANK_ERROR_MESSAGES.INVALID_AMOUNT("transfer"));
    }

    if (decimalAmount.gt(new Decimal(fromAccount.getBalance()))) {
      throw new Error(BANK_ERROR_MESSAGES.EXCEEDS_BALANCE);
    }
    fromAccount.withdraw({ amount: decimalAmount.toNumber() });
    toAccount.deposit({ amount: decimalAmount.toNumber() });
  }

  getInterestRate({ accountNumber }) {
    const account = retrieveAccount(accountNumber, this.#accounts);
    if (!account) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }
    return account.interestRate;
  }

  getBalance({ accountNumber }) {
    const account = retrieveAccount(accountNumber, this.#accounts);
    if (!account) {
      throw new Error(BANK_ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
    }
    return account.getBalance();
  }

  compoundInterest() {
    this.#accounts.forEach((account) => {
      account.compoundInterest();
    });
  }
}
