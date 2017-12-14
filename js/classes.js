class Task{
  constructor(task, quantity){
    this.name = task;
    this.quantity = quantity;
    this.id = new Date().getTime();
    this.status = 0;
    return this;
  }
}