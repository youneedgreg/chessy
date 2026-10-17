/**
 * The engine diagnostic page is for development only. Production builds must
 * answer `/test-engine` with a 404.
 */
export function isEngineDiagnosticsEnabled(nodeEnv: string | undefined): boolean {
    return nodeEnv !== 'production';
}
