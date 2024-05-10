/**
 * @group node
 */
describe('Configs', () => {
  it('exports FUEL_NETWORK_URL', async () => {
    const configs = await import('./configs');
    expect(configs.FUEL_NETWORK_URL).toBe('http://127.0.0.1:4000/v1/graphql');
  });

  it('exports FUEL_BETA_5_NETWORK_URL', async () => {
    const configs = await import('./configs');
    expect(configs.FUEL_BETA_5_NETWORK_URL).toBe(
      'https://beta-5.fuel.network/graphql',
    );
  });
});

describe('Configs - undefined process', () => {
  const originalProcess = process;

  beforeEach(() => {
    vi.resetModules();

    // @ts-expect-error - test to assert undefined process

    process = undefined;
  });

  afterEach(() => {
    process = originalProcess;
  });

  it('exports FUEL_NETWORK_URL with undefined process', async () => {
    expect(typeof process).toBe('undefined');
    expect(process).toBeUndefined();

    const configs = await import('./configs');

    expect(configs.FUEL_NETWORK_URL).toBe('http://127.0.0.1:4000/v1/graphql');
  });
});

describe('Configs - overridden env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();

    process.env = {
      ...originalEnv,
      FUEL_NETWORK_URL: 'some-other-network-url',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('exports FUEL_NETWORK_URL with overridden env', async () => {
    const configs = await import('./configs');

    expect(configs.FUEL_NETWORK_URL).toBe('some-other-network-url');
  });
});
