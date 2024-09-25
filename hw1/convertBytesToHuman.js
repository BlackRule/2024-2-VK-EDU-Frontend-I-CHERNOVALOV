/*
 * В этом задании надо разработать функцию
 * `convertBytesToHuman`. Эта функция должна принимать
 * аргумент `bytes` только числового типа.
 * На выходе функция должна отдать
 * человекопонятную строку, которая будет
 * отражать размер файла. Округление, максимум,
 * до 2 знаков после запятой, исключая нули.
 * Примеры использования:
 * Были здесь, но перенесены в тесты
 * Необходимо предусмотреть защиту от
 * передачи аргументов неправильного типа
 * и класса (например, отрицательные числа).
 * В случае передачи неподходящего аргумента,
 * функция должна вернуть false.
 */
//todo add BigInt support
export default function convertBytesToHuman(bytes) {
  if ((typeof bytes) !== 'number') return false;
  //NaN? -> false
  if (bytes !== bytes) return false;
  //not int-like? -> false
  if (Math.trunc(bytes) !== bytes) return false;
  if (bytes < 0 || bytes === Infinity) return false;
  const prefixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let prefixIndex = Math.floor(Math.log2(bytes) / 10);
  if (prefixIndex === -Infinity) prefixIndex = 0
  return `${+(bytes / 2 ** (10 * prefixIndex)).toFixed(2)} ${prefixes[prefixIndex]}B`;
}
