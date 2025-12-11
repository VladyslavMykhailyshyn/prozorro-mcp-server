import axios from 'axios';
import { z } from 'zod';

export const SearchTendersSchema = z.object({
    EDRPOUCode: z.string().optional().describe("The unique EDRPOUCode identifier code of the procuring entity (e.g., '01976387')."),
    legalName: z.string().optional().describe("A substring of the legal name to search for (case-insensitive)."),
    dateFrom: z.string().optional().describe("Filter tenders starting on or after this date (ISO 8601, e.g., '2023-01-01')."),
    dateTo: z.string().optional().describe("Filter tenders ending on or before this date (ISO 8601)."),
    limit: z.number().optional().default(100).describe("Max number of records to return. Requests >100 will default to 100."),
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

    const params: Record<string, string | number> = {};
    if (args.EDRPOUCode) params.EDRPOUCode = args.EDRPOUCode;
    if (args.legalName) params.legalName = args.legalName;
    if (args.dateFrom) params.dateFrom = args.dateFrom;
    if (args.dateTo) params.dateTo = args.dateTo;
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
