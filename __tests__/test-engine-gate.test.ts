// Tests for the production gate on the engine diagnostic page
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEngineDiagnosticsEnabled } from '../src/app/test-engine/gate.ts';

test('engine diagnostics are hidden when NODE_ENV is production', () => {
    assert.equal(isEngineDiagnosticsEnabled('production'), false);
});

test('engine diagnostics stay available in development', () => {
    assert.equal(isEngineDiagnosticsEnabled('development'), true);
});
