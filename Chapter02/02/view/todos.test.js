import todosView from './todos';

let targetElement;

describe('todosView', () => {
  beforeEach(() => {
    targetElement = document.createElement('ul');
  });

  test('shold create an li for every todo element', () => {
    const newTodo = todosView(targetElement, {
      todos: [
        {
          text: 'First',
          completed: true,
        },
        {
          text: 'Second',
          completed: false,
        },
        {
          text: 'Third',
          completed: false,
        },
      ],
    });

    const items = newTodo.querySelectorAll('li');
    expect(items.length).toBe(3);
  });

  test('should set the right attributes to every li according to the todos',
      () => {
        const newCounter = todosView(targetElement, {
          todos: [
            {
              text: 'First',
              completed: true,
            },
            {
              text: 'Second',
              completed: false,
            },
          ],
        });

        const [firstItem, secondItem] = newCounter.querySelectorAll('li');

        expect(firstItem.classList.contains('completed')).toBe(true);
        expect(firstItem.querySelector('.toggle').checked).toBe(true);
        expect(firstItem.querySelector('label').textContent).toBe('First');
        expect(firstItem.querySelector('.edit').value).toBe('First');

        expect(secondItem.classList.contains('completed')).toBe(false);
        expect(secondItem.querySelector('.toggle').checked).toBe(false);
        expect(secondItem.querySelector('label').textContent).toBe('Second');
        expect(secondItem.querySelector('.edit').value).toBe('Second');
      });
});
