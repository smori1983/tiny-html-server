const { describe, it } = require('mocha');
const { given } = require('mocha-testdata');
const assert = require('assert');
const SUT = require('../../src/background/util.ssi');

describe('background.util.ssi', () => {
  describe('checkIncludeAttribute', () => {
    it('virtual attribute - absolute path', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_100.html';

      const result = SUT.checkIncludeAttribute(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('virtual attribute - relative path', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_101.html';

      const result = SUT.checkIncludeAttribute(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('file attribute - absolute path', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_102.html';

      const result = SUT.checkIncludeAttribute(rootDir, reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.strictEqual(result.error[0].path, '/index_102.html');
      assert.strictEqual(result.error[0].code, '<!--#include file="/ssi/ssi_01.html" -->');
    });

    it('file attribute - relative path', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_103.html';

      const result = SUT.checkIncludeAttribute(rootDir, reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.strictEqual(result.error[0].path, '/index_103.html');
      assert.strictEqual(result.error[0].code, '<!--#include file="ssi/ssi_01.html" -->');
    });

    given([
      {reqPath: '/index_200.html'},
      {reqPath: '/index_201.html'},
      {reqPath: '/index_202.html'},
      {reqPath: '/index_203.html'},
      {reqPath: '/index_300.html'},
      {reqPath: '/index_301.html'},
      {reqPath: '/index_302.html'},
      {reqPath: '/index_303.html'},
    ]).it('ok patterns', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkIncludeAttribute(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });

  describe('checkCircularInclusion', () => {
    it('no SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_200.html';

      const result = SUT.checkCircularInclusion(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('valid SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_201.html';

      const result = SUT.checkCircularInclusion(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('1 circular inclusion', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_202.html';

      const result = SUT.checkCircularInclusion(rootDir, reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.deepStrictEqual(result.error, [
        ['/index_202.html', '/ssi/ssi_02.html', '/ssi/ssi_03.html', '/ssi/ssi_02.html'],
      ]);
    });

    it('2 circular inclusions', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_203.html';

      const result = SUT.checkCircularInclusion(rootDir, reqPath);

      assert.strictEqual(result.error.length, 2);
      assert.deepStrictEqual(result.error, [
        ['/index_203.html', '/ssi/ssi_02.html', '/ssi/ssi_03.html', '/ssi/ssi_02.html'],
        ['/index_203.html', '/ssi/ssi_03.html', '/ssi/ssi_02.html', '/ssi/ssi_03.html'],
      ]);
    });

    given([
      {reqPath: '/index_100.html'},
      {reqPath: '/index_101.html'},
      {reqPath: '/index_102.html'},
      {reqPath: '/index_103.html'},
      {reqPath: '/index_300.html'},
      {reqPath: '/index_301.html'},
      {reqPath: '/index_302.html'},
      {reqPath: '/index_303.html'},
    ]).it('ok patterns', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkCircularInclusion(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });

  describe('checkFileExistence', () => {
    it('no SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_300.html';

      const result = SUT.checkFileExistence(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('valid SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_301.html';

      const result = SUT.checkFileExistence(rootDir, reqPath);

      assert.strictEqual(result.error.length, 0);
    });

    it('1 invalid SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_302.html';

      const result = SUT.checkFileExistence(rootDir, reqPath);

      assert.strictEqual(result.error.length, 1);
      assert.strictEqual(result.error[0].path, '/index_302.html');
      assert.strictEqual(result.error[0].code, '<!--#include virtual="/ssi/foo.html" -->');
    });

    it('2 invalid SSI', () => {
      const rootDir = __dirname + '/../background_resource/dir_01';
      const reqPath = '/index_303.html';

      const result = SUT.checkFileExistence(rootDir, reqPath);

      assert.strictEqual(result.error.length, 2);
      assert.strictEqual(result.error[0].path, '/index_303.html');
      assert.strictEqual(result.error[0].code, '<!--#include virtual="/ssi/foo.html" -->');
      assert.strictEqual(result.error[1].path, '/index_303.html');
      assert.strictEqual(result.error[1].code, '<!--#include virtual="/ssi/bar.html" -->');
    });

    given([
      {reqPath: '/index_100.html'},
      {reqPath: '/index_101.html'},
      {reqPath: '/index_102.html'},
      {reqPath: '/index_103.html'},
      {reqPath: '/index_200.html'},
      {reqPath: '/index_201.html'},
      {reqPath: '/index_202.html'},
      {reqPath: '/index_203.html'},
    ]).it('ok patterns', (arg) => {
      const rootDir = __dirname + '/../background_resource/dir_01';

      const result = SUT.checkFileExistence(rootDir, arg.reqPath);

      assert.strictEqual(result.error.length, 0);
    });
  });
});
