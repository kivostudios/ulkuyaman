// T.C. Kimlik No Mernis check digit dogrulamasi.
//
// Kurallar:
//   1. 11 haneli, sayisal
//   2. Ilk hane 0 olamaz
//   3. (1+3+5+7+9. haneler) * 7 - (2+4+6+8. haneler) mod 10 == 10. hane
//   4. Ilk 10 hanenin toplamı mod 10 == 11. hane
//
// Kaynak: Mernis (Nüfus ve Vatandaşlık İşleri).

export function isValidTCKimlik(tc: string): boolean {
  if (typeof tc !== "string") return false;
  const cleaned = tc.trim();
  if (!/^[1-9][0-9]{10}$/.test(cleaned)) return false;

  const digits = cleaned.split("").map(Number);
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]; // 1,3,5,7,9
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];           // 2,4,6,8

  // 10. hane (index 9)
  const expected10 = ((oddSum * 7) - evenSum) % 10;
  if (((expected10 + 10) % 10) !== digits[9]) return false;

  // 11. hane (index 10)
  const sumFirst10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  if (sumFirst10 % 10 !== digits[10]) return false;

  return true;
}
