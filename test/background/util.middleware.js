const { describe, it } = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const SUT = require('../../src/background/util.middleware');

describe('background.util.middleware', () => {
  it('handle get', () => {
    const req = {method: 'GET'};
    const res = {};
    const next = sinon.spy();
    const cb = sinon.spy();

    SUT.getOnlyMiddleware(cb)(req, res, next);

    assert.strictEqual(cb.calledOnce, true);
    assert.strictEqual(next.called, false);
  });

  it('handle post', () => {
    const req = {method: 'POST'};
    const res = {};
    const next = sinon.spy();
    const cb = sinon.spy();

    SUT.getOnlyMiddleware(cb)(req, res, next);

    assert.strictEqual(cb.called, false);
    assert.strictEqual(next.calledOnce, true);
  });
});
