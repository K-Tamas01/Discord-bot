class Queue {
    constructor() {
        this.items = [];
    }

    // elem hozzáadása a sor végéhez
    enqueue(element) {
        this.items.push(element);
    }

    // elem eltávolítása a sor elejéről
    dequeue() {
        if(this.isEmpty())
            return undefined;
        return this.items.shift();
    }

    // a sor elejének lekérdezése eltávolítás nélkül
    peek() {
        if(this.isEmpty())
            return undefined;
        return this.items[0];
    }

    // a sor üres-e
    isEmpty() {
        return this.items.length == 0;
    }

    size() {
        return this.items.length;
    }

    shuffle(){
        for(let i = 1; i < this.size(); i++){
            const j = Math.floor(Math.random() * (i - 1))
            [this.items[i], this.items[j]] = [this.items[j], this.items[i]]
        }
    }

}

module.exports = Queue