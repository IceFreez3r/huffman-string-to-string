# Huffman String to String

Needed a way to compress a string before storing it in localStorage, which only allows 2-byte-character-strings, and an excuse to use bit operations.

## Usage

```ts
const text = 'Hello, World!';
const { compressed, codes, skipLast } = HuffmanEncoding.encode(text);
localStorage.setItem('compressed', JSON.stringify([compressed, codes, skipLast]));
```

```ts
const [compressed, codes, skipLast] = JSON.parse(localStorage.getItem('compressed'));
const decoded = HuffmanEncoding.decode(compressed, codes, skipLast);
console.log(decoded)
```
