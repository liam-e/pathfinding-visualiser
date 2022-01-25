class Event {
    listeners: any[];
    
    constructor() {
      this.listeners = [];
    }
  
    addListener(listener: any) {
      this.listeners.push(listener);
    }
  
    trigger(params: any) {
      this.listeners.forEach(listener => { listener(params); });
    }
  }
  
  export default Event;