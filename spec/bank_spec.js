import { Bank } from "../src/bank.js";
import { BANK_ERROR_MESSAGES } from "../src/bank.js";
import { BankAccount } from "../src/bank_account.js";

describe("Bank", () => {
  let bank;
  beforeEach(() => {
    bank = new Bank();
  });

  describe("addAccountType", () => {
    it("should add a new account type", () => {
      bank.addAccountType({ accountType: "savings", interestRate: 0.05 });
      const accountTypes = Array.from(bank.accountTypes);
      expect(accountTypes.length).toEqual(1);
      expect(accountTypes[0]).toEqual({
        accountType: "savings",
        interestRate: 0.05,
      });
    });

    it("should throw an error if account type already exists", () => {
      bank.addAccountType({ accountType: "savings", interestRate: 0.05 });
      expect(() => {
        bank.addAccountType({ accountType: "savings", interestRate: 0.05 });
      }).toThrowError(BANK_ERROR_MESSAGES.ACCOUNT_TYPE_EXISTS);
    });

    it("should throw an error if interest rate is negative", () => {
      expect(() => {
        bank.addAccountType({ accountType: "savings", interestRate: -0.01 });
      }).toThrowError(BANK_ERROR_MESSAGES.NEGATIVE_INTEREST_RATE);
    });
  });

  describe("openBankAccount", () => {
    it("should open a new bank account", () => {
      bank.addAccountType({ accountType: "savings", interestRate: 0.05 });
      const accountNumber = bank.openBankAccount({ accountType: "savings" });
      expect(accountNumber).toBeDefined();
      expect(bank.accounts.get(accountNumber)).toBeInstanceOf(BankAccount);
    });

    it("should throw an error if account type is invalid", () => {
      expect(() => {
        bank.openBankAccount({ accountType: "invalid" });
      }).toThrowError(BANK_ERROR_MESSAGES.INVALID_ACCOUNT_TYPE);
    });
  });
});
