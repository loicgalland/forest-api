import { passwordValidation } from "./password.service";

describe("PasswordService", () => {
  it("Should return true", () => {
    expect(passwordValidation("123AZERTY!456azerty!789456123")).toBe(true);
  });
  it("should return false", () => {
    expect(passwordValidation("1234567891011121314151617")).toBe(false);
    expect(passwordValidation("azertyiopqsdfghjklmwxcvbn")).toBe(false);
    expect(passwordValidation("123azret!enofhgqsjnqkjgdfnqskjjng")).toBe(false);
    expect(passwordValidation("aihejdabfqskfgbfqd!DSFDGFDSHGD")).toBe(false);
    expect(passwordValidation("123456789!DSFDGFDSHGD")).toBe(false);
    expect(passwordValidation("123456789!aefnsgjfndsgjkfdsng;")).toBe(false);
    expect(passwordValidation("123456789aEFDfnsgjfndsgjkfdsng;")).toBe(false);
  });
});
