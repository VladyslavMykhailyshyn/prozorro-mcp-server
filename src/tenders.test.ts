import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { SearchTendersSchema, searchTenders } from './tenders.js';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
        isAxiosError: () => false,
    },
}));

describe('searchTenders param passthrough', () => {
    beforeEach(() => {
        process.env.PROZORRO_SERVICE_URL = 'example.test';
        process.env.PROZORRO_API_TOKEN = 'test-token';
        vi.mocked(axios.get).mockResolvedValue({ data: { data: [] } });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('omits new params when not provided', async () => {
        await searchTenders({ limit: 100, offset: 0 } as any);
        const [, config] = vi.mocked(axios.get).mock.calls[0];
        expect(config?.params).not.toHaveProperty('sortBy');
        expect(config?.params).not.toHaveProperty('tendererName');
        expect(config?.params).not.toHaveProperty('includeTotal');
        expect(config?.params).toEqual({ limit: 100 });
    });

    it('forwards includeTotal only when explicitly true', async () => {
        await searchTenders({ limit: 100, offset: 0, includeTotal: true } as any);
        const [, config] = vi.mocked(axios.get).mock.calls[0];
        expect(config?.params).toEqual({ limit: 100, includeTotal: true });
    });

    it('forwards sortBy, offset, and tendererName when provided', async () => {
        await searchTenders({
            sortBy: 'amount_desc',
            offset: 200,
            tendererName: 'Петренко',
            limit: 50,
        } as any);
        const [, config] = vi.mocked(axios.get).mock.calls[0];
        expect(config?.params).toEqual({
            sortBy: 'amount_desc',
            offset: 200,
            tendererName: 'Петренко',
            limit: 50,
        });
    });

    it('still clamps limit to 100 server-side regardless of requested value', async () => {
        await searchTenders({ limit: 500, offset: 0 } as any);
        const [, config] = vi.mocked(axios.get).mock.calls[0];
        expect(config?.params).toEqual({ limit: 100 });
    });
});

describe('SearchTendersSchema validation', () => {
    it('accepts a valid sortBy value', () => {
        const result = SearchTendersSchema.safeParse({ sortBy: 'dateModified_desc' });
        expect(result.success).toBe(true);
    });

    it('rejects an invalid sortBy value', () => {
        const result = SearchTendersSchema.safeParse({ sortBy: 'not_a_real_option' });
        expect(result.success).toBe(false);
    });
});
