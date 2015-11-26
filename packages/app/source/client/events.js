Space.messaging.define(Space.messaging.Event, 'Todos', {

  // ======= Routing =======
  RouteRequested: {
    routeName: String,
    params: Match.Optional(Object)
  },

  RouteTriggered: {
    routeName: String,
    params: Match.Optional(Object)
  },

  // ======= UI events =======

  TodoCreated: {
    title: String
  }

});
