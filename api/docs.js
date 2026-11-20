import { getDocsResponse } from '../server/docs-response.js';

export default async function docs(request, response) {
  const result = await getDocsResponse(request.method);
  for (const [key, value] of Object.entries(result.headers)) response.setHeader(key, value);
  response.status(result.status).json(result.body);
}
