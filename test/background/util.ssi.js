const { describe } = require('mocha');
const { given } = require('mocha-testdata');
const assert = require('assert');
const SUT = require('../../src/background/util.ssi');

describe('background.util.ssi', () => {
  describe('checkIncludeAttribute', () => {
    given([
      {reqPath: '/index_09_fayy.html', code: '<!--#include file="/ssi/ssi_02.html" -->'},
      {reqPath: '/index_10_fayn.html', code: '<!--#include file="/ssi/ssi_01.html" -->'},
      {reqPath: '/index_11_fany.html', code: '<!--#include file="/ssi_02.html" -->'},
      {reqPath: '/index_12_fann.html', code: '<!--#include file="/ssi_01.html" -->'},
      {reqPath: '/index_13_fryy.html', code: '<!--#include file="ssi/ssi_02.html" -->'},
      {reqPath: '/index_14_fryn.html', code: '<!--#include file="ssi/ssi_01.html" -->'},
      {reqPath: '/index_15_frny.html', code: '<!--#include file="ssi_02.html" -->'},
      {reqPath: '/index_16_frnn.html', code: '<!--#include file="ssi_01.html" -->'},
    ]).it('error pattern', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkIncludeAttribute(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.strictEqual(result.error[0].code, arg.code);
    });

    given([
      {reqPath: '/index_00_zzzz.html'},
      {reqPath: '/index_01_vayy.html'},
      {reqPath: '/index_02_vayn.html'},
      {reqPath: '/index_03_vany.html'},
      {reqPath: '/index_04_vann.html'},
      {reqPath: '/index_05_vryy.html'},
      {reqPath: '/index_06_vryn.html'},
      {reqPath: '/index_07_vrny.html'},
      {reqPath: '/index_08_vrnn.html'},
    ]).it('ok pattern', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkIncludeAttribute(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });

  describe('checkCircularInclusion', () => {
    given([
      {
        reqPath: '/index_01_vayy.html',
        error: [
          '/index_01_vayy.html',
          '/ssi/ssi_02.html',
          '/ssi/ssi_03.html',
          '/ssi/ssi_02.html',
        ],
      },
      {
        reqPath: '/index_05_vryy.html',
        error: [
          '/index_05_vryy.html',
          '/ssi/ssi_02.html',
          '/ssi/ssi_03.html',
          '/ssi/ssi_02.html',
        ],
      },
    ]).it('error pattern', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkCircularInclusion(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.deepStrictEqual(result.error, [arg.error]);
    });

    given([
      {reqPath: '/index_00_zzzz.html'},
      {reqPath: '/index_02_vayn.html'},
      {reqPath: '/index_03_vany.html'},
      {reqPath: '/index_04_vann.html'},
      {reqPath: '/index_06_vryn.html'},
      {reqPath: '/index_07_vrny.html'},
      {reqPath: '/index_08_vrnn.html'},
      {reqPath: '/index_09_fayy.html'},
      {reqPath: '/index_10_fayn.html'},
      {reqPath: '/index_11_fany.html'},
      {reqPath: '/index_12_fann.html'},
      {reqPath: '/index_13_fryy.html'},
      {reqPath: '/index_14_fryn.html'},
      {reqPath: '/index_15_frny.html'},
      {reqPath: '/index_16_frnn.html'},
    ]).it('ok pattern', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkCircularInclusion(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });

  describe('checkFileExistence', () => {
    given([
      {reqPath: '/index_03_vany.html', code: '<!--#include virtual="/ssi_02.html" -->'},
      {reqPath: '/index_04_vann.html', code: '<!--#include virtual="/ssi_01.html" -->'},
      {reqPath: '/index_07_vrny.html', code: '<!--#include virtual="ssi_02.html" -->'},
      {reqPath: '/index_08_vrnn.html', code: '<!--#include virtual="ssi_01.html" -->'},
    ]).it('error pattern', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkFileExistence(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.strictEqual(result.error[0].path, arg.reqPath);
      assert.strictEqual(result.error[0].code, arg.code);
    });

    given([
      {reqPath: '/index_00_zzzz.html'},
      {reqPath: '/index_01_vayy.html'},
      {reqPath: '/index_02_vayn.html'},
      {reqPath: '/index_05_vryy.html'},
      {reqPath: '/index_06_vryn.html'},
      {reqPath: '/index_09_fayy.html'},
      {reqPath: '/index_10_fayn.html'},
      {reqPath: '/index_11_fany.html'},
      {reqPath: '/index_12_fann.html'},
      {reqPath: '/index_13_fryy.html'},
      {reqPath: '/index_14_fryn.html'},
      {reqPath: '/index_15_frny.html'},
      {reqPath: '/index_16_frnn.html'},
    ]).it('ok patterns', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkFileExistence(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });
});
