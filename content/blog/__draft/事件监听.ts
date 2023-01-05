type EventType = string | symbol

class mitt<Events extends Record<EventType,unknown>> {
  events: Record<keyof Events,unknown>
  
  
  constructor() {
    // this.events = {}
  }

  // 抛出事件
  emit(key: EventType) {}

  // 监听事件
  on() {}

  once() {}

  remove() {}
}

// https://segmentfault.com/a/1190000041526820
