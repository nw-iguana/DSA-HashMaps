class HashMap {
  constructor(initialCapacity = 8, SIZE_RATIO = 3, MAX_LOAD_RATIO = 0.7) {
    this.length = 0;
    this._hashTable = [],
    this._capacity = initialCapacity,
    this._deleted = 0;
    this.MAX_LOAD_RATIO = MAX_LOAD_RATIO;
    this.SIZE_RATIO = SIZE_RATIO;
  }

  _hashString(string) {
    //Black box hashing algorithm
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] == undefined) {
      return undefined;
    }
    return this._hashTable[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if(loadRatio > this.MAX_LOAD_RATIO) {
      this._resize(this._capacity * this.SIZE_RATIO)
    }

    //find the slot where this key should be in 
    const index = this._findSlot(key);

    if(!this._hashTable[index]) {
      this.length++;
    }
    this._hashTable[index] = {
      key,
      value,
      DELETED: false
    };
  }

  delete(key) {
    const index = this._findSlot(key);
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }

    slot.DELETED = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = this._hashString(key); //very large number;
    const start = hash % this._capacity;

    for(let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._hashTable[index];
      if (slot === undefined || (slot.key == key && !slot.DELETED)) {
        return index;
      }
    }
  }

  _resize(size) {
    const oldSlots = this._hashTable;
    this._capacity = size;
    this.length = 0;
    this._deleted = 0;
    this._hashTable = [];

    for(const slot of oldSlots) {
      if(slot !== undefined && !slot.DELETED) {
        this.set(slot.key, slot.value);
      }
    }
  }
}

module.exports = HashMap;
