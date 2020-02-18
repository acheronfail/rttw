import { ApiGetPuzzlesResponse, ApiPostSubmitResponse } from '@rttw/common';
import { Dispatch } from 'react';
import { TestResult } from '../editor/eval';
import { ActionPayload, setPuzzlesAction, setSolvedModalStateAction, setUserAction } from '../store/actions';

type ServerResponse<T> = {
  response: Response;
  data: T;
};

const handleFetchResponse = async <T extends any>(response: Response): Promise<ServerResponse<T>> => {
  if (response.ok) {
    if (response.headers.get('content-type')?.includes('json')) {
      return { response, data: await response.json() };
    }

    return { response, data: (await response.text()) as any };
  }

  const responseText = await response.text().catch(e => e.message);
  throw new Error(`${response.status} ${response.statusText} ${responseText}`);
};

const get = <T extends any>(url: string): Promise<ServerResponse<T>> => fetch(url).then(handleFetchResponse);

const post = <T extends any>(url: string, data: Record<string, any>): Promise<ServerResponse<T>> =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleFetchResponse);

export async function getPuzzles(id: string | null, dispatch: Dispatch<ActionPayload>) {
  return get<ApiGetPuzzlesResponse>(`/api/puzzles/${id || ''}`).then(({ data }) => {
    const { puzzles, user } = data;
    dispatch(setPuzzlesAction(puzzles));
    dispatch(setUserAction(user));
  });
}

export async function submitSolution(id: string | null, result: TestResult, dispatch: Dispatch<ActionPayload>) {
  const { name, solution } = result;
  return post<ApiPostSubmitResponse>('/api/submit', { id, name, solution }).then(({ data }) => {
    const { user } = data;
    dispatch(setUserAction(user));

    dispatch(
      setSolvedModalStateAction({
        show: true,
        solutionLength: user.solutions[name]?.length || solution.length,
      }),
    );

    // Trigger another get puzzles (there may be more to fetch if the solution
    // was verified by the server). We use the new id because if this was the
    // first request, the id was just created.
    return getPuzzles(user._id, dispatch);
  });
}
