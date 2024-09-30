import convertBytesToHuman from './convertBytesToHuman';


test('Возвращает false для неправильного типа данных', () => {
  expect(convertBytesToHuman(-1)).toBe(false)
  expect(convertBytesToHuman(1.1)).toBe(false)
  expect(convertBytesToHuman(NaN)).toBe(false)
  expect(convertBytesToHuman(Infinity)).toBe(false)
  expect(convertBytesToHuman(-Infinity)).toBe(false)
  expect(convertBytesToHuman()).toBe(false)
  expect(convertBytesToHuman(undefined)).toBe(false)
  expect(convertBytesToHuman('string')).toBe(false)
  expect(convertBytesToHuman(true)).toBe(false)
  expect(convertBytesToHuman(false)).toBe(false)
  expect(convertBytesToHuman([])).toBe(false)
  expect(convertBytesToHuman({})).toBe(false)
  expect(convertBytesToHuman(() => {
  })).toBe(false)
  expect(convertBytesToHuman(null)).toBe(false)
  expect(convertBytesToHuman(Symbol('symbol'))).toBe(false)
});

test('Возвращает корректное значение для чисел', () => {
  expect(convertBytesToHuman(0)).toBe('0 B')
  expect(convertBytesToHuman(5.0)).toBe('5 B')
  expect(convertBytesToHuman(1023)).toBe('1023 B')
  expect(convertBytesToHuman(1024)).toBe('1 KB')
  expect(convertBytesToHuman(123123123)).toBe('117.42 MB')
  expect(convertBytesToHuman(Math.trunc(117.4*1024**2))).toBe('117.4 MB')
  expect(convertBytesToHuman(1610612736)).toBe('1.5 GB')
  //todo Add TB PB EB ZB YB
  //max pre BigInt
  // convertBytesToHuman(9007199254740991) is ~ '8 PB'
  // so BigInt needs to be handled?
  // expect(convertBytesToHuman(10n)).toBe('10 B')
});