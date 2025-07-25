import { BankAccount } from "../src/bank_account.js";
import Decimal from "decimal.js";
import { ERROR_MESSAGES } from "../src/bank_account.js";

describe("BankAccount", () => {
  describe("constructor", () => {
    it("should initialize with zero balance and default interest rate", () => {
      const account = new BankAccount();
      expect(account.getBalance().equals(new Decimal(0))).toBe(true);
      expect(account.interestRate.equals(new Decimal(0))).toBe(true);
    });
    it("should set a custom interest rate", () => {
      const account = new BankAccount({ interestRate: 5 });
      expect(account.interestRate.equals(new Decimal(5))).toBe(true);
    });
    it("should throw for negative interest rate", () => {
      expect(() => new BankAccount({ interestRate: -1 })).toThrowError(
        ERROR_MESSAGES.INVALID_INTEREST_RATE
      );
    });
  });

  describe("deposit", () => {
    it("should increase balance by deposit amount", () => {
      const account = new BankAccount();
      account.deposit({ amount: 100 });
      expect(account.getBalance().equals(new Decimal(100))).toBe(true);
    });
    it("should throw for non-positive deposit", () => {
      const account = new BankAccount();
      expect(() => account.deposit({ amount: 0 })).toThrowError(
        ERROR_MESSAGES.INVALID_AMOUNT
      );
      expect(() => account.deposit({ amount: -10 })).toThrowError(
        ERROR_MESSAGES.INVALID_AMOUNT
      );
    });
  });

  describe("withdraw", () => {
    it("should decrease balance by withdrawal amount", () => {
      const account = new BankAccount();
      account.deposit({ amount: 100 });
      account.withdraw({ amount: 40 });
      expect(account.getBalance().equals(new Decimal(60))).toBe(true);
    });
    it("should throw for non-positive withdrawal", () => {
      const account = new BankAccount();
      expect(() => account.withdraw({ amount: 0 })).toThrowError(
        ERROR_MESSAGES.INVALID_AMOUNT
      );
      expect(() => account.withdraw({ amount: -10 })).toThrowError(
        ERROR_MESSAGES.INVALID_AMOUNT
      );
    });
    it("should throw for insufficient funds", () => {
      const account = new BankAccount();
      account.deposit({ amount: 50 });
      expect(() => account.withdraw({ amount: 100 })).toThrowError(
        ERROR_MESSAGES.INSUFFICIENT_FUNDS
      );
    });
  });

  describe("compoundInterest", () => {
    it("should add monthly interest to balance", () => {
      const account = new BankAccount({ interestRate: 12 });
      account.deposit({ amount: 1200 });
      account.compoundInterest();
      expect(account.getBalance().equals(new Decimal(1212))).toBe(true);
    });
  });

  describe("updateBalance", () => {
    it("should add amount to balance", () => {
      const account = new BankAccount();
      account.updateBalance(50);
      expect(account.getBalance().equals(new Decimal(50))).toBe(true);
    });
  });
});
