import axios from 'axios';
import { z } from 'zod';

export const SearchTendersSchema = z.object({
    EDRPOUCode: z.string().optional().describe("The unique EDRPOUCode identifier code of the procuring entity (e.g., '01976387')."),
    legalName: z.string().optional().describe("A substring of the legal name to search for (case-insensitive)."),
    tendererName: z.string().optional().describe("Search by tenderer/supplier/bidder name (not the procuring government entity — use `legalName` for that). Use this to find individual entrepreneurs (FOPs) as bidders, since their EDRPOU-style IDs are masked upstream and can't be searched by ID."),
    dateFrom: z.string().optional().describe("Filter tenders starting on or after this date (ISO 8601, e.g., '2023-01-01')."),
    dateTo: z.string().optional().describe("Filter tenders ending on or before this date (ISO 8601)."),
    sortBy: z.enum(["amount_desc", "amount_asc", "dateModified_desc", "dateModified_asc"]).optional()
        .describe("Sort order. Use 'amount_desc' for biggest tenders by value, 'dateModified_desc' for most recent. Sorting is applied server-side across the full matching dataset, not just the returned page."),
    offset: z.number().optional().default(0)
        .describe("Records to skip, for paging beyond the first `limit` results. Combine with the same filters/sortBy across calls; keep paging until a page returns fewer than `limit` results."),
    includeTotal: z.boolean().optional()
        .describe("If true, the response includes `total_count`: the true total number of matching results across all pages (e.g. to answer 'how many tenders total'). Costs an extra query server-side, so leave this off for routine paging where you don't need the number."),
    limit: z.number().optional().default(100).describe("Max records per page (server hard-caps at 100 regardless of value requested). To retrieve more than 100 results, repeat the call increasing `offset` by 100 each time, using the same filters/sortBy, until a page comes back with fewer than `limit` results."),
});

export type SearchTendersArgs = z.infer<typeof SearchTendersSchema>;

export async function searchTenders(args: SearchTendersArgs) {
    const serviceUrl = process.env.PROZORRO_SERVICE_URL;
    const token = process.env.PROZORRO_API_TOKEN;

    if (!serviceUrl) {
        throw new Error("PROZORRO_SERVICE_URL environment variable is not set");
    }

    if (!token) {
        throw new Error("PROZORRO_API_TOKEN environment variable is not set");
    }

    const baseUrl = `https://${serviceUrl}/api/v1/tenders`;

    const params: Record<string, string | number | boolean> = {};
    if (args.EDRPOUCode) params.EDRPOUCode = args.EDRPOUCode;
    if (args.legalName) params.legalName = args.legalName;
    if (args.tendererName) params.tendererName = args.tendererName;
    if (args.dateFrom) params.dateFrom = args.dateFrom;
    if (args.dateTo) params.dateTo = args.dateTo;
    if (args.sortBy) params.sortBy = args.sortBy;
    if (args.offset) params.offset = args.offset;
    if (args.includeTotal) params.includeTotal = args.includeTotal;
    if (args.limit) params.limit = Math.min(args.limit, 100);

    try {
        const response = await axios.get(baseUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params,
        });

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Prozorro API error: ${error.response?.status} ${error.response?.statusText} - ${JSON.stringify(error.response?.data)}`);
        }
        throw error;
    }
}
