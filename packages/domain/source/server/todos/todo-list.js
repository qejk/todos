Space.eventSourcing.Aggregate.extend(Todos, 'TodoList', {

  fields: {
    name: String,
    todos: [Todos.TodoItem]
  },

  commandMap() {
    return {
      'Todos.CreateTodoList': this._createTodoList,
      'Todos.CreateTodo': this._createTodo,
      'Todos.CompleteTodo': this._completeTodo,
      'Todos.ReopenTodo': this._reopenTodo
    };
  },

  eventMap() {
    return {
      'Todos.TodoListCreated': this._onTodoListCreated,
      'Todos.TodoCreated': this._onTodoCreated,
      'Todos.TodoCompleted': this._onTodoCompleted,
      'Todos.TodoReopened': this._onTodoReopened
    };
  },

  // ============= COMMAND HANDLERS =============

  _createTodoList(command) {
    this.record(new Todos.TodoListCreated(this._eventPropsFromCommand(command)));
  },

  _createTodo(command) {
    this.record(new Todos.TodoCreated(this._eventPropsFromCommand(command)));
  },

  _completeTodo(command) {

    let todo = this._findTodoById(command.todoId.id);

    if (todo instanceof Todos.TodoItem && todo.isCompleted === true) {
      throw new Todos.TodoCannotBeCompleted();
    } else {
      this.record(new Todos.TodoCompleted(this._eventPropsFromCommand(command)));
    }

  },

  _reopenTodo(command) {

    let todo = this._findTodoById(command.todoId.id);

    if (todo instanceof Todos.TodoItem && todo.isCompleted === false) {
      throw new Todos.TodoCannotBeReopened();
    } else {
      this.record(new Todos.TodoReopened(this._eventPropsFromCommand(command)));
    }

  },

  // ============= EVENT HANDLERS ============

  _onTodoListCreated(event) {
    this._assignFields(event);
    this.todos = [];
  },

  _onTodoCreated(event) {

    let todo = new Todos.TodoItem({
      id: event.id,
      title: event.title,
      isCompleted: event.isCompleted
    });

    this.todos.push(todo);
  },

  _onTodoCompleted(event) {
    let todo = this._findTodoById(event.todoId.id);
    todo.isCompleted = true;
  },

  _onTodoReopened(event) {
    let todo = this._findTodoById(event.todoId.id);
    todo.isCompleted = false;
  },

  // ============= HELPERS ============

  _findTodoById(id) {

    let todo = _.find(this.todos, function(todo) {
      return (todo.id.id === id);
    });

    return todo;
  }

});

Todos.TodoList.registerSnapshotType(`Todos.TodoList`);
