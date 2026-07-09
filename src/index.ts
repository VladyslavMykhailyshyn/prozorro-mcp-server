#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import dotenv from "dotenv";
import { searchTenders, SearchTendersSchema } from "./tenders.js";

dotenv.config();

const server = new Server(
    {
        name: "prozorro-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_tenders",
                description: "Search for government tenders by EDRPOUCode, legal name, tenderer/supplier name, or date range. Supports sortBy (e.g. 'amount_desc' for the biggest tenders, 'dateModified_desc' for the most recent) and offset-based pagination beyond 100 rows. Note: individual-entrepreneur (FOP) tenderers can't be reliably found by EDRPOU code due to upstream ID masking — search by tendererName instead.",
                inputSchema: zodToJsonSchema(SearchTendersSchema) as any,
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "search_tenders") {
        throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
    }

    const validationResult = SearchTendersSchema.safeParse(request.params.arguments);
    if (!validationResult.success) {
        throw new McpError(ErrorCode.InvalidParams, "Invalid arguments: " + validationResult.error.message);
    }

    try {
        const result = await searchTenders(validationResult.data);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    } catch (error: any) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error searching tenders: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

const transport = new StdioServerTransport();
await server.connect(transport);
