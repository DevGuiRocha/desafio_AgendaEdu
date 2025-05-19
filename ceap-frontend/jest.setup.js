// jest.setup.js

// 1) polyfill para TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 2) extensão do Testing Library
require('@testing-library/jest-dom');
