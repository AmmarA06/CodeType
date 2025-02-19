export interface CodeSnippet {
  id: string;
  language: string;
  code: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const codeSnippets: CodeSnippet[] = [
  // ========== PYTHON SNIPPETS (20) ==========
  {
    id: 'py-1',
    language: 'python',
    difficulty: 'easy',
    code: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`
  },
  {
    id: 'py-2',
    language: 'python',
    difficulty: 'easy',
    code: `numbers = [1, 2, 3, 4, 5]
squared = [n ** 2 for n in numbers]
print(squared)`
  },
  {
    id: 'py-3',
    language: 'python',
    difficulty: 'easy',
    code: `def is_even(num):
    return num % 2 == 0

for i in range(10):
    if is_even(i):
        print(f"{i} is even")`
  },
  {
    id: 'py-4',
    language: 'python',
    difficulty: 'easy',
    code: `fruits = ["apple", "banana", "cherry"]
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")`
  },
  {
    id: 'py-5',
    language: 'python',
    difficulty: 'easy',
    code: `def add(a, b):
    return a + b

result = add(5, 3)
print(f"Sum: {result}")`
  },
  {
    id: 'py-6',
    language: 'python',
    difficulty: 'medium',
    code: `class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, x, y):
        self.result = x + y
        return self.result

calc = Calculator()
print(calc.add(5, 3))`
  },
  {
    id: 'py-7',
    language: 'python',
    difficulty: 'medium',
    code: `def count_vowels(text):
    vowels = "aeiouAEIOU"
    return sum(1 for char in text if char in vowels)

sentence = "Hello World"
print(f"Vowels: {count_vowels(sentence)}")`
  },
  {
    id: 'py-8',
    language: 'python',
    difficulty: 'medium',
    code: `import json

data = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

json_string = json.dumps(data, indent=2)
print(json_string)`
  },
  {
    id: 'py-9',
    language: 'python',
    difficulty: 'medium',
    code: `def find_max(numbers):
    if not numbers:
        return None
    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val

nums = [3, 7, 2, 9, 1]
print(find_max(nums))`
  },
  {
    id: 'py-10',
    language: 'python',
    difficulty: 'medium',
    code: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"I'm {self.name}, {self.age} years old"

person = Person("Bob", 25)
print(person.introduce())`
  },
  {
    id: 'py-11',
    language: 'python',
    difficulty: 'medium',
    code: `def merge_dicts(dict1, dict2):
    result = dict1.copy()
    result.update(dict2)
    return result

a = {"x": 1, "y": 2}
b = {"y": 3, "z": 4}
print(merge_dicts(a, b))`
  },
  {
    id: 'py-12',
    language: 'python',
    difficulty: 'hard',
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

numbers = [fibonacci(i) for i in range(10)]
print(numbers)`
  },
  {
    id: 'py-13',
    language: 'python',
    difficulty: 'hard',
    code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))`
  },
  {
    id: 'py-14',
    language: 'python',
    difficulty: 'hard',
    code: `def decorator_timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"Time: {end - start:.4f}s")
        return result
    return wrapper

@decorator_timer
def slow_function():
    sum(range(1000000))

slow_function()`
  },
  {
    id: 'py-15',
    language: 'python',
    difficulty: 'hard',
    code: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, data):
        if not self.head:
            self.head = Node(data)
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = Node(data)`
  },
  {
    id: 'py-16',
    language: 'python',
    difficulty: 'medium',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
  },
  {
    id: 'py-17',
    language: 'python',
    difficulty: 'easy',
    code: `def reverse_string(s):
    return s[::-1]

text = "Hello World"
reversed_text = reverse_string(text)
print(reversed_text)`
  },
  {
    id: 'py-18',
    language: 'python',
    difficulty: 'medium',
    code: `def word_frequency(text):
    words = text.lower().split()
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1
    return freq

sentence = "hello world hello"
print(word_frequency(sentence))`
  },
  {
    id: 'py-19',
    language: 'python',
    difficulty: 'hard',
    code: `def flatten_list(nested_list):
    result = []
    for item in nested_list:
        if isinstance(item, list):
            result.extend(flatten_list(item))
        else:
            result.append(item)
    return result

nested = [1, [2, 3], [[4], 5]]
print(flatten_list(nested))`
  },
  {
    id: 'py-20',
    language: 'python',
    difficulty: 'medium',
    code: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop() if self.items else None

stack = Stack()
stack.push(1)
stack.push(2)
print(stack.pop())`
  },

  // ========== JAVASCRIPT SNIPPETS (20) ==========
  {
    id: 'js-1',
    language: 'javascript',
    difficulty: 'easy',
    code: `const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet("World"));`
  },
  {
    id: 'js-2',
    language: 'javascript',
    difficulty: 'easy',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
  },
  {
    id: 'js-3',
    language: 'javascript',
    difficulty: 'easy',
    code: `function isEven(num) {
  return num % 2 === 0;
}

for (let i = 0; i < 10; i++) {
  if (isEven(i)) {
    console.log(\`\${i} is even\`);
  }
}`
  },
  {
    id: 'js-4',
    language: 'javascript',
    difficulty: 'easy',
    code: `const fruits = ["apple", "banana", "cherry"];
fruits.forEach((fruit, index) => {
  console.log(\`\${index}: \${fruit}\`);
});`
  },
  {
    id: 'js-5',
    language: 'javascript',
    difficulty: 'easy',
    code: `const add = (a, b) => a + b;

const result = add(5, 3);
console.log(\`Sum: \${result}\`);`
  },
  {
    id: 'js-6',
    language: 'javascript',
    difficulty: 'medium',
    code: `class Calculator {
  constructor() {
    this.result = 0;
  }

  add(x, y) {
    this.result = x + y;
    return this.result;
  }
}

const calc = new Calculator();
console.log(calc.add(5, 3));`
  },
  {
    id: 'js-7',
    language: 'javascript',
    difficulty: 'medium',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = doubled.reduce((a, b) => a + b, 0);

console.log(\`Sum: \${sum}\`);`
  },
  {
    id: 'js-8',
    language: 'javascript',
    difficulty: 'medium',
    code: `function countVowels(text) {
  const vowels = "aeiouAEIOU";
  return [...text].filter(char => vowels.includes(char)).length;
}

const sentence = "Hello World";
console.log(\`Vowels: \${countVowels(sentence)}\`);`
  },
  {
    id: 'js-9',
    language: 'javascript',
    difficulty: 'medium',
    code: `const person = {
  name: "Alice",
  age: 30,
  city: "New York"
};

const jsonString = JSON.stringify(person, null, 2);
console.log(jsonString);`
  },
  {
    id: 'js-10',
    language: 'javascript',
    difficulty: 'medium',
    code: `function findMax(numbers) {
  if (numbers.length === 0) return null;
  return Math.max(...numbers);
}

const nums = [3, 7, 2, 9, 1];
console.log(findMax(nums));`
  },
  {
    id: 'js-11',
    language: 'javascript',
    difficulty: 'medium',
    code: `class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return \`I'm \${this.name}, \${this.age} years old\`;
  }
}

const person = new Person("Bob", 25);
console.log(person.introduce());`
  },
  {
    id: 'js-12',
    language: 'javascript',
    difficulty: 'hard',
    code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData('https://api.example.com/data');`
  },
  {
    id: 'js-13',
    language: 'javascript',
    difficulty: 'hard',
    code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

const result = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log(result);`
  },
  {
    id: 'js-14',
    language: 'javascript',
    difficulty: 'hard',
    code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFunc = debounce(() => console.log('Called!'), 1000);`
  },
  {
    id: 'js-15',
    language: 'javascript',
    difficulty: 'hard',
    code: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  append(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
  }
}`
  },
  {
    id: 'js-16',
    language: 'javascript',
    difficulty: 'medium',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
  },
  {
    id: 'js-17',
    language: 'javascript',
    difficulty: 'easy',
    code: `const reverseString = (str) => str.split('').reverse().join('');

const text = "Hello World";
const reversed = reverseString(text);
console.log(reversed);`
  },
  {
    id: 'js-18',
    language: 'javascript',
    difficulty: 'medium',
    code: `function wordFrequency(text) {
  const words = text.toLowerCase().split(' ');
  const freq = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });
  return freq;
}

console.log(wordFrequency("hello world hello"));`
  },
  {
    id: 'js-19',
    language: 'javascript',
    difficulty: 'hard',
    code: `function flattenArray(arr) {
  return arr.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
}

const nested = [1, [2, 3], [[4], 5]];
console.log(flattenArray(nested));`
  },
  {
    id: 'js-20',
    language: 'javascript',
    difficulty: 'medium',
    code: `class Stack {
  constructor() {
    this.items = [];
  }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop());`
  },

  // ========== C++ SNIPPETS (15) ==========
  {
    id: 'cpp-1',
    language: 'cpp',
    difficulty: 'easy',
    code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  },
  {
    id: 'cpp-2',
    language: 'cpp',
    difficulty: 'easy',
    code: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(5, 3) << endl;
    return 0;
}`
  },
  {
    id: 'cpp-3',
    language: 'cpp',
    difficulty: 'easy',
    code: `#include <iostream>
using namespace std;

int main() {
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            cout << i << " is even" << endl;
        }
    }
    return 0;
}`
  },
  {
    id: 'cpp-4',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <vector>
#include <iostream>

int sum(const std::vector<int>& nums) {
    int total = 0;
    for (int num : nums) {
        total += num;
    }
    return total;
}

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    std::cout << sum(numbers) << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-5',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <iostream>
#include <string>

class Person {
public:
    Person(std::string n, int a) : name(n), age(a) {}

    void introduce() {
        std::cout << "I'm " << name << ", " << age << " years old" << std::endl;
    }

private:
    std::string name;
    int age;
};

int main() {
    Person p("Alice", 30);
    p.introduce();
    return 0;
}`
  },
  {
    id: 'cpp-6',
    language: 'cpp',
    difficulty: 'hard',
    code: `#include <memory>
#include <iostream>

class Node {
public:
    int data;
    std::shared_ptr<Node> next;

    Node(int val) : data(val), next(nullptr) {}
};

int main() {
    auto head = std::make_shared<Node>(1);
    head->next = std::make_shared<Node>(2);
    std::cout << head->data << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-7',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <algorithm>
#include <vector>
#include <iostream>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    std::sort(nums.begin(), nums.end());

    for (int num : nums) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-8',
    language: 'cpp',
    difficulty: 'hard',
    code: `#include <iostream>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    for (int i = 0; i < 10; i++) {
        std::cout << fibonacci(i) << " ";
    }
    std::cout << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-9',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <iostream>
#include <vector>

template<typename T>
T findMax(const std::vector<T>& vec) {
    T maxVal = vec[0];
    for (const T& val : vec) {
        if (val > maxVal) maxVal = val;
    }
    return maxVal;
}

int main() {
    std::vector<int> nums = {3, 7, 2, 9, 1};
    std::cout << findMax(nums) << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-10',
    language: 'cpp',
    difficulty: 'hard',
    code: `#include <iostream>
#include <stack>

class Stack {
private:
    std::stack<int> s;

public:
    void push(int val) {
        s.push(val);
    }

    int pop() {
        int val = s.top();
        s.pop();
        return val;
    }

    bool isEmpty() {
        return s.empty();
    }
};`
  },
  {
    id: 'cpp-11',
    language: 'cpp',
    difficulty: 'easy',
    code: `#include <iostream>
#include <string>

std::string reverseString(const std::string& str) {
    return std::string(str.rbegin(), str.rend());
}

int main() {
    std::cout << reverseString("Hello") << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-12',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <iostream>

int binarySearch(int arr[], int size, int target) {
    int left = 0, right = size - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
  },
  {
    id: 'cpp-13',
    language: 'cpp',
    difficulty: 'hard',
    code: `#include <iostream>
#include <vector>

void quicksort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}`
  },
  {
    id: 'cpp-14',
    language: 'cpp',
    difficulty: 'medium',
    code: `#include <iostream>
#include <map>

int main() {
    std::map<std::string, int> ages;
    ages["Alice"] = 30;
    ages["Bob"] = 25;

    for (const auto& pair : ages) {
        std::cout << pair.first << ": " << pair.second << std::endl;
    }
    return 0;
}`
  },
  {
    id: 'cpp-15',
    language: 'cpp',
    difficulty: 'easy',
    code: `#include <iostream>

bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    std::cout << isPrime(17) << std::endl;
    return 0;
}`
  },

  // ========== RUST SNIPPETS (15) ==========
  {
    id: 'rust-1',
    language: 'rust',
    difficulty: 'easy',
    code: `fn main() {
    let name = "World";
    println!("Hello, {}!", name);
}`
  },
  {
    id: 'rust-2',
    language: 'rust',
    difficulty: 'easy',
    code: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result = add(5, 3);
    println!("Sum: {}", result);
}`
  },
  {
    id: 'rust-3',
    language: 'rust',
    difficulty: 'easy',
    code: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    for num in &numbers {
        println!("{}", num);
    }
}`
  },
  {
    id: 'rust-4',
    language: 'rust',
    difficulty: 'medium',
    code: `fn is_even(num: i32) -> bool {
    num % 2 == 0
}

fn main() {
    for i in 0..10 {
        if is_even(i) {
            println!("{} is even", i);
        }
    }
}`
  },
  {
    id: 'rust-5',
    language: 'rust',
    difficulty: 'medium',
    code: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("Area: {}", rect.area());
}`
  },
  {
    id: 'rust-6',
    language: 'rust',
    difficulty: 'medium',
    code: `fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    for i in 0..10 {
        println!("{}", fibonacci(i));
    }
}`
  },
  {
    id: 'rust-7',
    language: 'rust',
    difficulty: 'hard',
    code: `use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, usize> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        *counts.entry(word.to_string()).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let text = "hello world hello";
    let counts = word_count(text);
    println!("{:?}", counts);
}`
  },
  {
    id: 'rust-8',
    language: 'rust',
    difficulty: 'medium',
    code: `fn find_max(numbers: &[i32]) -> Option<i32> {
    if numbers.is_empty() {
        return None;
    }
    Some(*numbers.iter().max().unwrap())
}

fn main() {
    let nums = vec![3, 7, 2, 9, 1];
    println!("{:?}", find_max(&nums));
}`
  },
  {
    id: 'rust-9',
    language: 'rust',
    difficulty: 'hard',
    code: `enum Result<T, E> {
    Ok(T),
    Err(E),
}

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Result::Err("Division by zero".to_string())
    } else {
        Result::Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Result::Ok(val) => println!("Result: {}", val),
        Result::Err(err) => println!("Error: {}", err),
    }
}`
  },
  {
    id: 'rust-10',
    language: 'rust',
    difficulty: 'medium',
    code: `struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn new(name: String, age: u32) -> Person {
        Person { name, age }
    }

    fn introduce(&self) {
        println!("I'm {}, {} years old", self.name, self.age);
    }
}

fn main() {
    let person = Person::new("Alice".to_string(), 30);
    person.introduce();
}`
  },
  {
    id: 'rust-11',
    language: 'rust',
    difficulty: 'easy',
    code: `fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

fn main() {
    let text = "Hello";
    println!("{}", reverse_string(text));
}`
  },
  {
    id: 'rust-12',
    language: 'rust',
    difficulty: 'hard',
    code: `fn binary_search(arr: &[i32], target: i32) -> Option<usize> {
    let mut left = 0;
    let mut right = arr.len();

    while left < right {
        let mid = left + (right - left) / 2;
        if arr[mid] == target {
            return Some(mid);
        } else if arr[mid] < target {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    None
}`
  },
  {
    id: 'rust-13',
    language: 'rust',
    difficulty: 'medium',
    code: `fn main() {
    let numbers: Vec<i32> = (1..6).collect();
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("{:?}", doubled);
}`
  },
  {
    id: 'rust-14',
    language: 'rust',
    difficulty: 'hard',
    code: `trait Animal {
    fn make_sound(&self) -> String;
}

struct Dog;
struct Cat;

impl Animal for Dog {
    fn make_sound(&self) -> String {
        "Woof!".to_string()
    }
}

impl Animal for Cat {
    fn make_sound(&self) -> String {
        "Meow!".to_string()
    }
}

fn main() {
    let dog = Dog;
    println!("{}", dog.make_sound());
}`
  },
  {
    id: 'rust-15',
    language: 'rust',
    difficulty: 'medium',
    code: `fn count_vowels(text: &str) -> usize {
    let vowels = "aeiouAEIOU";
    text.chars()
        .filter(|c| vowels.contains(*c))
        .count()
}

fn main() {
    let sentence = "Hello World";
    println!("Vowels: {}", count_vowels(sentence));
}`
  },
];

export const getSnippetsByLanguage = (language: string): CodeSnippet[] => {
  return codeSnippets.filter(snippet => snippet.language === language);
};

export const getRandomSnippet = (language: string): CodeSnippet | null => {
  const snippets = getSnippetsByLanguage(language);
  if (snippets.length === 0) return null;
  return snippets[Math.floor(Math.random() * snippets.length)];
};
