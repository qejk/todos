describe("Todos.Todo", function() {

  beforeEach(function() {
    this.todoListId = new Guid();
    this.todoId = new Guid();
    this.todoListData = {
      name: 'MyTodos'
    };
    this.todoData = {
      title: 'My Todo',
      isCompleted: false
    };

  });

  describe("creating a new todo list", function() {

    it("publishes a todo list created event", function() {
      Todos.domain.test(Todos.TodoList)
        .given()
        .when(
          new Todos.CreateTodoList(_.extend({}, this.todoListData, {
            targetId: this.todoListId
          }))
        )
        .expect([
          new Todos.TodoListCreated(_.extend({}, this.todoListData, {
            sourceId: this.todoListId,
            timestamp: new Date(),
            version: 1
          }))
        ]);
    });
  });

  describe("creating a new todo", function() {

    let todoListCreated = function() {
      return new Todos.TodoListCreated(_.extend({}, this.todoListData, {
        sourceId: this.todoListId,
        version: 1
      }));
    };

    it("publishes a todo created event", function() {
      Todos.domain.test(Todos.TodoList)
        .given([todoListCreated.call(this)])
        .when(
          new Todos.CreateTodo(_.extend({}, this.todoData, {
            targetId: this.todoListId,
            id: this.todoId
          }))
        )
        .expect([
          new Todos.TodoCreated(_.extend({}, this.todoData, {
            sourceId: this.todoListId,
            timestamp: new Date(),
            version: 2,
            id: this.todoId
          }))
        ]);
    });
  });

  describe("completing todo", function() {

    let todoListAndTodoCreated = function() {

      let listCreated = new Todos.TodoListCreated(_.extend({}, this.todoListData, {
        sourceId: this.todoListId,
        version: 1
      }));

      let todoCreated = new Todos.TodoCreated(_.extend({}, this.todoData, {
        sourceId: this.todoListId,
        version: 2,
        id: this.todoId
      }));

      return [listCreated, todoCreated];
    };

    it("completes todo", function() {
      Todos.domain.test(Todos.TodoList)
        .given(todoListAndTodoCreated.call(this))
        .when([
          new Todos.CompleteTodo(_.extend({}, {}, {
            targetId: this.todoListId,
            id: this.todoId
          }))]
        )
        .expect([
          new Todos.TodoCompleted(_.extend({}, {}, {
            sourceId: this.todoListId,
            timestamp: new Date(),
            version: 2,
            id: this.todoId
          }))
        ]);
    });


    let todoListWithCompletedTodo = function() {

      let listCreated = new Todos.TodoListCreated(_.extend({}, this.todoListData, {
        sourceId: this.todoListId,
        version: 1
      }));

      let todoCreated = new Todos.TodoCreated(_.extend({}, this.todoData, {
        sourceId: this.todoListId,
        version: 2,
        id: this.todoId,
        isCompleted: true
      }));

      return [listCreated, todoCreated];
    };

    it("does not allow completion of completed todos", function() {
      Todos.domain.test(Todos.TodoList)
        .given(todoListWithCompletedTodo.call(this))
        .when([
          new Todos.CompleteTodo(_.extend({}, {}, {
            targetId: this.todoListId,
            id: this.todoId
          }))]
        )
        .expectToFailWith(new Todos.TodoCannotBeCompleted());
    });

  });

});
