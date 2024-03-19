class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if(this.isEmpty())
            return undefined;
        return this.items.shift();
    }

    removeElement(index) {
        if(this.isEmpty() || index > this.size())
            return undefined;
        return this.items.splice(index, 1)
    }
    
    peek() {
        if(this.isEmpty())
            return undefined;
        return this.items[0];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    size() {
        return this.items.length;
    }

    shuffle(){
        this.items.sort(() => Math.random() - 0.5);
    }

    destroy(){
        return this.items = [];
    }
}

module.exports = Queue