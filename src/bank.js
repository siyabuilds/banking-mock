import { BankAccount } from "./bank_account";

const getInterest = ({ accountType }, accountTypes) => {
  for (const type of accountTypes) {
    if (type === accountType) {
      return BankAccount.getInterestRate(type);
    }
  }
  throw new Error("Invalid account type");
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
    if (this.#accountTypes.has(accountType)) {
      throw new Error("Account type already exists");
    }
    if (interestRate < 0) {
      throw new Error("Interest rate cannot be negative");
    }
    this.#accountTypes.add(accountType);
  }
}
