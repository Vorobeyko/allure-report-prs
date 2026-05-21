import { test, expect } from '@playwright/test';
import {
  step,
  tags,
  tag,
  severity,
  feature,
  story,
  attachment,
  parameter,
  ContentType,
} from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import type { APIResponse } from '@playwright/test';
import { isTodo, type Todo } from '../../src/todo';

test.describe('Todos API', () => {
  test('GET /todos — returns list of todos', async ({ request }) => {
    await severity(Severity.CRITICAL);
    await feature('Todos');
    await story('List todos');
    await tags('api', 'smoke');

    const response = await step<APIResponse>('Send GET /todos', async () => {
      return request.get('/todos');
    });

    await step('Verify 200 OK', async () => {
      expect(response.status()).toBe(200);
    });

    const todos = await step<Todo[]>('Parse response body', async () => {
      const body = await response.json() as Todo[];
      await attachment(
        'First todo',
        JSON.stringify(body[0], null, 2),
        ContentType.JSON
      );
      return body;
    });

    await step('Validate response structure', async () => {
      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
      expect(isTodo(todos[0])).toBe(true);
    });
  });

  test('GET /todos/:id — returns single todo', async ({ request }) => {
    await severity(Severity.NORMAL);
    await feature('Todos');
    await story('Get todo by id');
    await parameter('todoId', '1');

    const response = await step<APIResponse>('Send GET /todos/1', async () => {
      return request.get('/todos/1');
    });

    const todo = await step<Todo>('Parse response', async () => {
      expect(response.status()).toBe(200);
      return response.json() as Promise<Todo>;
    });

    await step('Validate todo schema', async () => {
      expect(todo).toMatchObject({
        id: expect.any(Number),
        userId: expect.any(Number),
        title: expect.any(String),
        completed: expect.any(Boolean),
      });
    });
  });

  test('POST /todos — creates new todo', async ({ request }) => {
    await severity(Severity.CRITICAL);
    await feature('Todos');
    await story('Create todo');
    await tags('api', 'regression');

    const payload = { userId: 1, title: 'Buy groceries', completed: false };

    await attachment('Request body', JSON.stringify(payload, null, 2), ContentType.JSON);

    const response = await step<APIResponse>('Send POST /todos', async () => {
      return request.post('/todos', { data: payload });
    });

    const created = await step<Todo>('Parse created todo', async () => {
      expect(response.status()).toBe(201);
      return response.json() as Promise<Todo>;
    });

    await step('Validate returned data matches request', async () => {
      expect(created.title).toBe(payload.title);
      expect(created.completed).toBe(payload.completed);
      expect(typeof created.id).toBe('number');

      await attachment('Created todo', JSON.stringify(created, null, 2), ContentType.JSON);
    });
  });

  test('PUT /todos/:id — updates existing todo', async ({ request }) => {
    await severity(Severity.NORMAL);
    await feature('Todos');
    await story('Update todo');
    await parameter('todoId', '1');

    const update = { id: 1, userId: 1, title: 'Updated title', completed: true };

    const response = await step<APIResponse>('Send PUT /todos/1', async () => {
      return request.put('/todos/1', { data: update });
    });

    await step('Verify 200 OK and updated data', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json() as Todo;
      expect(body.title).toBe(update.title);
      expect(body.completed).toBe(update.completed);
    });
  });

  test('DELETE /todos/:id — deletes todo', async ({ request }) => {
    await severity(Severity.NORMAL);
    await feature('Todos');
    await story('Delete todo');
    await parameter('todoId', '1');

    const response = await step<APIResponse>('Send DELETE /todos/1', async () => {
      return request.delete('/todos/1');
    });

    await step('Verify 200 OK', async () => {
      expect(response.status()).toBe(200);
    });
  });

  test('GET /todos/99999 — returns 404 for unknown id', async ({ request }) => {
    await severity(Severity.MINOR);
    await feature('Error Handling');
    await story('Not found');
    await tag('negative');

    const response = await step<APIResponse>('Send GET /todos/99999', async () => {
      return request.get('/todos/99999');
    });

    expect(response.status()).toBe(404);
  });
});
