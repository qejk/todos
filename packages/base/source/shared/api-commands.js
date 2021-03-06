Space.messaging.define(Space.domain.Command, 'Todos', {

  CreateTodoList: {
    name: String
  },

  CreateTodo: {
    title: String
  },

  CompleteTodo: {
    todoId: Guid
  },

  ReopenTodo: {
    todoId: Guid
  },

  RemoveTodo: {
    todoId: Guid
  },

  ChangeTodoTitle: {
    todoId: Guid,
    newTitle: String
  }

});
