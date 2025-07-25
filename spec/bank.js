import { BankAccount } from "../src/bank_account";

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
}
