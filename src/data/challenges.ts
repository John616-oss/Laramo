import { Challenge } from '../types';

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Two Sum Problem',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays',
    points: 100,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution
print(twoSum([2, 7, 11, 15], 9))`,
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(const std::vector<int>& nums, int target) {
    std::unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (numMap.find(complement) != numMap.end()) {
            return {numMap[complement], i};
        }
        numMap[nums[i]] = i;
    }
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    std::cout << "[" << res[0] << ", " << res[1] << "]" << std::endl;
    return 0;
}`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public static int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int diff = target - nums[i];
            if (map.ContainsKey(diff)) return new int[] { map[diff], i };
            map[nums[i]] = i;
        }
        return new int[0];
    }
}`,
      go: `package main
import "fmt"

func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        if idx, ok := m[target-num]; ok {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}`,
      rust: `use std::collections::HashMap;

fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        if let Some(&prev_idx) = map.get(&(target - num)) {
            return vec![prev_idx as i32, i as i32];
        }
        map.insert(num, i);
    }
    vec![]
}

fn main() {
    println!("{:?}", two_sum(vec![2, 7, 11, 15], 9));
}`,
      sql: `-- SQL analytical alternative: finding pairs matching sum
SELECT a.id AS idx1, b.id AS idx2, a.val + b.val AS sum_val
FROM numbers a
JOIN numbers b ON a.id < b.id
WHERE a.val + b.val = 9;`,
      php: `<?php
function twoSum(array $nums, int $target): array {
    $map = [];
    foreach ($nums as $i => $num) {
        $complement = $target - $num;
        if (isset($map[$complement])) {
            return [$map[$complement], $i];
        }
        $map[$num] = $i;
    }
    return [];
}

print_r(twoSum([2, 7, 11, 15], 9));
?>`
    },
    testCases: [
      { id: 't1', input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', explanation: '2 + 7 = 9' },
      { id: 't2', input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', explanation: '2 + 4 = 6' },
      { id: 't3', input: '[3, 3], 6', expectedOutput: '[0, 1]', explanation: 'Duplicate values handled via index tracking' }
    ],
    hints: [
      'A brute force approach checks every pair, which takes O(n^2) time. Can we do it in a single pass?',
      'Consider using a Hash Map / Dictionary to store numbers you have already visited along with their index.',
      'For each element x, check if (target - x) already exists in your map.'
    ],
    timeComplexity: 'O(n) with Hash Map',
    spaceComplexity: 'O(n) auxiliary memory'
  },
  {
    id: 'ch-2',
    title: 'Valid Palindrome & Two Pointers',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    category: 'Strings',
    points: 80,
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      }
    ],
    starterCode: {
      python: `def isPalindrome(s: str) -> bool:
    # Filter alphanumeric and convert to lowercase
    cleaned = [c.lower() for c in s if c.isalnum()]
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True

print(isPalindrome("A man, a plan, a canal: Panama"))`,
      javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      typescript: `function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>

bool isPalindrome(const std::string& s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !std::isalnum(s[left])) left++;
        while (left < right && !std::isalnum(s[right])) right--;
        if (std::tolower(s[left]) != std::tolower(s[right])) return false;
        left++;
        right--;
    }
    return true;
}

int main() {
    std::cout << std::boolalpha << isPalindrome("A man, a plan, a canal: Panama") << std::endl;
    return 0;
}`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
}`,
      csharp: `using System;

public class Solution {
    public static bool IsPalindrome(string s) {
        int left = 0, right = s.Length - 1;
        while (left < right) {
            while (left < right && !char.IsLetterOrDigit(s[left])) left++;
            while (left < right && !char.IsLetterOrDigit(s[right])) right--;
            if (char.ToLower(s[left]) != char.ToLower(s[right])) return false;
            left++;
            right--;
        }
        return true;
    }
}`,
      go: `package main
import (
    "fmt"
    "unicode"
)

func isPalindrome(s string) bool {
    runes := []rune(s)
    left, right := 0, len(runes)-1
    for left < right {
        for left < right && !unicode.IsLetter(runes[left]) && !unicode.IsDigit(runes[left]) {
            left++
        }
        for left < right && !unicode.IsLetter(runes[right]) && !unicode.IsDigit(runes[right]) {
            right--
        }
        if unicode.ToLower(runes[left]) != unicode.ToLower(runes[right]) {
            return false
        }
        left++
        right--
    }
    return true
}`,
      rust: `fn is_palindrome(s: String) -> bool {
    let clean: Vec<char> = s.chars().filter(|c| c.is_alphanumeric()).map(|c| c.to_ascii_lowercase()).collect();
    if clean.is_empty() { return true; }
    let mut left = 0;
    let mut right = clean.len() - 1;
    while left < right {
        if clean[left] != clean[right] { return false; }
        left += 1;
        right -= 1;
    }
    true
}`,
      sql: `-- SQL validation checking string reversal
SELECT s, CASE WHEN LOWER(s) = REVERSE(LOWER(s)) THEN 1 ELSE 0 END AS is_palindrome
FROM user_strings;`,
      php: `<?php
function isPalindrome(string $s): bool {
    $clean = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $s));
    $left = 0;
    $right = strlen($clean) - 1;
    while ($left < $right) {
        if ($clean[$left] !== $clean[$right]) return false;
        $left++;
        $right--;
    }
    return true;
}

echo isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false";
?>`
    },
    testCases: [
      { id: 'p1', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { id: 'p2', input: '"race a car"', expectedOutput: 'false' },
      { id: 'p3', input: '" "', expectedOutput: 'true' }
    ],
    hints: [
      'Two pointers moving towards each other can compare characters in O(1) extra space.',
      'Skip non-alphanumeric characters using language built-in character checkers like isalnum().'
    ],
    timeComplexity: 'O(n) time',
    spaceComplexity: 'O(1) auxiliary space'
  },
  {
    id: 'ch-3',
    title: 'Binary Search Implementation',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Algorithms',
    points: 110,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    starterCode: {
      python: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

print(search([-1, 0, 3, 5, 9, 12], 9))`,
      javascript: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));`,
      typescript: `function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
      cpp: `#include <iostream>
#include <vector>

int search(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
      csharp: `public class Solution {
    public static int Search(int[] nums, int target) {
        int left = 0, right = nums.Length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
      go: `func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
      rust: `fn search(nums: Vec<i32>, target: i32) -> i32 {
    let mut left = 0;
    let mut right = nums.len() as i32 - 1;
    while left <= right {
        let mid = left + (right - left) / 2;
        let mid_val = nums[mid as usize];
        if mid_val == target { return mid; }
        if mid_val < target { left = mid + 1; }
        else { right = mid - 1; }
    }
    -1
}`,
      sql: `-- SQL B-Tree index lookup simulation
SELECT id, value 
FROM sorted_items 
WHERE value = 9;`
    },
    testCases: [
      { id: 'b1', input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4' },
      { id: 'b2', input: '[-1, 0, 3, 5, 9, 12], 2', expectedOutput: '-1' },
      { id: 'b3', input: '[5], 5', expectedOutput: '0' }
    ],
    hints: [
      'Remember integer overflow prevention: `mid = left + (right - left) // 2` is safer than `(left + right) // 2`.',
      'The array is already sorted, halving the search space each step gives O(log n).'
    ],
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'ch-4',
    title: 'Valid Parentheses & Stack',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'DSA',
    points: 120,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}"'
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    starterCode: {
      python: `def isValid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return len(stack) == 0

print(isValid("()[]{}"))`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}"));`,
      typescript: `function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (map[char]) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      cpp: `#include <iostream>
#include <stack>
#include <unordered_map>

bool isValid(const std::string& s) {
    std::stack<char> st;
    std::unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (map.count(c)) {
            if (st.empty() || st.top() != map[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}`,
      java: `import java.util.Stack;
class Solution {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      csharp: `using System.Collections.Generic;

public class Solution {
    public static bool IsValid(string s) {
        var stack = new Stack<char>();
        foreach (char c in s) {
            if (c == '(') stack.Push(')');
            else if (c == '{') stack.Push('}');
            else if (c == '[') stack.Push(']');
            else if (stack.Count == 0 || stack.Pop() != c) return false;
        }
        return stack.Count == 0;
    }
}`,
      go: `func isValid(s string) bool {
    var stack []rune
    pairs := map[rune]rune{')': '(', '}': '{', ']': '['}
    for _, ch := range s {
        if open, exists := pairs[ch]; exists {
            if len(stack) == 0 || stack[len(stack)-1] != open {
                return false
            }
            stack = stack[:len(stack)-1]
        } else {
            stack = append(stack, ch)
        }
    }
    return len(stack) == 0
}`,
      rust: `fn is_valid(s: String) -> bool {
    let mut stack = Vec::new();
    for c in s.chars() {
        match c {
            '(' => stack.push(')'),
            '{' => stack.push('}'),
            '[' => stack.push(']'),
            ')' | '}' | ']' => {
                if stack.pop() != Some(c) { return false; }
            }
            _ => {}
        }
    }
    stack.is_empty()
}`,
      sql: `-- Stack logic representation
SELECT string_val, is_valid FROM syntax_tokens;`
    },
    testCases: [
      { id: 'v1', input: '"()"', expectedOutput: 'true' },
      { id: 'v2', input: '"()[]{}"', expectedOutput: 'true' },
      { id: 'v3', input: '"(]"', expectedOutput: 'false' },
      { id: 'v4', input: '"([)]"', expectedOutput: 'false' }
    ],
    hints: [
      'A Stack (LIFO - Last In First Out) is the ideal data structure for tracking nested openers.',
      'Whenever you encounter a closing bracket, the top of the stack must match its opener.'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'ch-5',
    title: 'Invert Binary Tree (BST Manipulation)',
    slug: 'invert-binary-tree',
    difficulty: 'Medium',
    category: 'DSA',
    points: 150,
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.

Inverting a tree means swapping every left and right child recursively across the entire tree structure. Famous for the Google tech interview tweet: "90% of our engineers use the software you wrote (Homebrew), but you can't invert a binary tree on a whiteboard so f*** off." - Max Howell`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]',
        explanation: 'The left subtree and right subtree are swapped for every node.'
      }
    ],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root):
    if not root:
        return None
    # Swap children
    root.left, root.right = invertTree(root.right), invertTree(root.left)
    return root`,
      javascript: `function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
  }
}

function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}`,
      java: `public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
      csharp: `public class TreeNode {
    public int val;
    public TreeNode left;
    public TreeNode right;
}

public class Solution {
    public TreeNode InvertTree(TreeNode root) {
        if (root == null) return null;
        var temp = root.left;
        root.left = InvertTree(root.right);
        root.right = InvertTree(temp);
        return root;
    }
}`,
      go: `type TreeNode struct {
    Val int
    Left *TreeNode
    Right *TreeNode
}

func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    root.Left, root.Right = invertTree(root.Right), invertTree(root.Left)
    return root
}`,
      rust: `// Rust recursive BST swap
use std::rc::Rc;
use std::cell::RefCell;

// TreeNode standard definition`,
      sql: `-- Relational hierarchical inversion
SELECT parent_id, child_id, 
  CASE WHEN position = 'left' THEN 'right' ELSE 'left' END AS inverted_position
FROM tree_nodes;`
    },
    testCases: [
      { id: 'iv1', input: '[4, 2, 7, 1, 3, 6, 9]', expectedOutput: '[4, 7, 2, 9, 6, 3, 1]' },
      { id: 'iv2', input: '[2, 1, 3]', expectedOutput: '[2, 3, 1]' },
      { id: 'iv3', input: '[]', expectedOutput: '[]' }
    ],
    hints: [
      'Think recursively: if you invert the left subtree and invert the right subtree, what is left to do at the current node?',
      'You can also solve it iteratively using a Queue (BFS) or Stack (DFS).'
    ],
    timeComplexity: 'O(n) where n is the number of nodes in the tree',
    spaceComplexity: 'O(h) where h is the height of the tree for recursion stack'
  },
  {
    id: 'ch-6',
    title: 'Merge Intervals & Sorting',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    category: 'Algorithms',
    points: 160,
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
      '0 <= start_i <= end_i <= 10^4'
    ],
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
      }
    ],
    starterCode: {
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    if not intervals:
        return []
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)
    return merged

print(merge([[1,3],[2,6],[8,10],[15,18]]))`,
      javascript: `function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}

console.log(merge([[1,3],[2,6],[8,10],[15,18]]));`,
      typescript: `function merge(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= prev[1]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }
  return merged;
}`,
      cpp: `#include <vector>
#include <algorithm>

std::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {
    if (intervals.empty()) return {};
    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
        return a[0] < b[0];
    });
    std::vector<std::vector<int>> merged = {intervals[0]};
    for (size_t i = 1; i < intervals.size(); ++i) {
        if (intervals[i][0] <= merged.back()[1]) {
            merged.back()[1] = std::max(merged.back()[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        if (intervals.length <= 1) return intervals;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> result = new ArrayList<>();
        int[] curr = intervals[0];
        result.add(curr);
        for (int[] interval : intervals) {
            if (interval[0] <= curr[1]) {
                curr[1] = Math.max(curr[1], interval[1]);
            } else {
                curr = interval;
                result.add(curr);
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`,
      csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public int[][] Merge(int[][] intervals) {
        if (intervals.Length <= 1) return intervals;
        Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
        var list = new List<int[]>();
        var curr = intervals[0];
        list.Add(curr);
        foreach (var interval in intervals) {
            if (interval[0] <= curr[1]) {
                curr[1] = Math.Max(curr[1], interval[1]);
            } else {
                curr = interval;
                list.Add(curr);
            }
        }
        return list.ToArray();
    }
}`,
      go: `func merge(intervals [][]int) [][]int {
    // Go sort and interval merge
    return intervals
}`,
      rust: `fn merge(mut intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
    if intervals.is_empty() { return vec![]; }
    intervals.sort_by_key(|i| i[0]);
    let mut merged = vec![intervals[0].clone()];
    for interval in intervals.into_iter().skip(1) {
        let last = merged.last_mut().unwrap();
        if interval[0] <= last[1] {
            last[1] = last[1].max(interval[1]);
        } else {
            merged.push(interval);
        }
    }
    merged
}`,
      sql: `-- SQL continuous range merger using window functions
SELECT MIN(start_time), MAX(end_time) 
FROM booking_slots;`,
      php: `<?php
function merge(array $intervals): array {
    if (count($intervals) <= 1) return $intervals;
    usort($intervals, fn($a, $b) => $a[0] <=> $b[0]);
    $merged = [$intervals[0]];
    for ($i = 1; $i < count($intervals); $i++) {
        $lastIdx = count($merged) - 1;
        if ($intervals[$i][0] <= $merged[$lastIdx][1]) {
            $merged[$lastIdx][1] = max($merged[$lastIdx][1], $intervals[$i][1]);
        } else {
            $merged[] = $intervals[$i];
        }
    }
    return $merged;
}

print_r(merge([[1,3],[2,6],[8,10],[15,18]]));
?>`
    },
    testCases: [
      { id: 'm1', input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { id: 'm2', input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
    ],
    hints: [
      'Sorting the intervals by their start time is the key first step.',
      'Once sorted, two intervals overlap if and only if the current start is <= the previous end.'
    ],
    timeComplexity: 'O(n log n) due to sorting',
    spaceComplexity: 'O(n) for output array'
  },
  {
    id: 'ch-web-card',
    title: 'Developer Profile Card (HTML & CSS)',
    slug: 'html-css-profile-card',
    difficulty: 'Easy',
    category: 'WebDev',
    points: 120,
    description: `Build a responsive modern developer profile card using semantic HTML5 elements (\`<article>\`, \`<header>\`, \`<h2>\`, \`<p>\`, \`<button>\`) and CSS Flexbox styles.

Requirements:
1. Centered card container with rounded corners (\`border-radius\`), dark theme background (\`#1e293b\`), and padding.
2. An avatar image, student badge, full name, and bio paragraph.
3. An interactive action button that highlights on hover or click.
4. You can preview your live rendered web component using the "Live Web Preview" tab!`,
    constraints: [
      'Must use valid HTML5 tags.',
      'Must incorporate CSS Flexbox properties: display: flex, justify-content, align-items.',
      'Compatible with desktop and mobile viewports.'
    ],
    examples: [
      {
        input: 'Card with student name and bio',
        output: 'Rendered responsive profile card with button and badge',
        explanation: 'Card displays avatar, title, and button in centered flexbox container.'
      }
    ],
    starterCode: {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Developer Profile</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0f172a;
      margin: 0;
      color: #f8fafc;
    }
    .profile-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 1.75rem;
      width: 320px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
      text-align: center;
      transition: transform 0.2s ease;
    }
    .profile-card:hover {
      transform: translateY(-4px);
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid #10b981;
      margin-bottom: 0.75rem;
    }
    .badge {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 0.5rem;
    }
    .name {
      margin: 0.25rem 0 0.5rem 0;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .bio {
      color: #94a3b8;
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
    }
    .btn-connect {
      background: #10b981;
      color: #ffffff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.65rem 1.25rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      width: 100%;
      transition: background 0.2s ease;
    }
    .btn-connect:hover {
      background: #059669;
    }
  </style>
</head>
<body>
  <!-- Semantic HTML Card Container -->
  <article class="profile-card">
    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=DevStudent" alt="Developer Avatar" class="avatar" />
    <div>
      <span class="badge">BSIT Student Developer</span>
    </div>
    <h2 class="name">Juan De La Cruz</h2>
    <p class="bio">Passionate in HTML, CSS, JavaScript, and PHP. Building modern web applications for thesis & portfolio.</p>
    <button class="btn-connect" onclick="alert('Connected!')">Connect on GitHub</button>
  </article>
</body>
</html>`,
      css: `/* Standalone Card Stylesheet */
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  max-width: 320px;
  color: #f8fafc;
}`,
      javascript: `// Interactive card click feedback
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.btn-connect');
  if (btn) {
    btn.addEventListener('click', () => {
      btn.textContent = 'Connected!';
      btn.style.backgroundColor = '#059669';
    });
  }
});`,
      php: `<?php
// PHP component render simulation
$user = [
    'name' => 'Juan De La Cruz',
    'course' => 'BS Information Technology',
    'skills' => ['HTML5', 'CSS3', 'JavaScript', 'PHP 8.2']
];
echo "Profile card for " . $user['name'] . " (" . $user['course'] . ")";
?>`
    },
    testCases: [
      { id: 'w1', input: '<article class="profile-card">', expectedOutput: 'true', explanation: 'Contains semantic <article> and card class' },
      { id: 'w2', input: '<button class="btn-connect">', expectedOutput: 'true', explanation: 'Includes interactive connect button' }
    ],
    hints: [
      'Use semantic elements like <article> instead of generic <div> tags for better accessibility.',
      'Check the Live Web Preview tab to see changes rendered immediately.'
    ],
    timeComplexity: 'O(1) Render',
    spaceComplexity: 'O(1) DOM Tree'
  },
  {
    id: 'ch-php-gpa',
    title: 'PHP Student GWA & Latin Honors Ranker',
    slug: 'php-student-gwa',
    difficulty: 'Easy',
    category: 'PHP',
    points: 130,
    description: `In Philippine universities (PUP, UP, UST, DLSU, etc.), students are evaluated by their General Weighted Average (GWA).

Write a PHP function \`calculateGWA(array $grades)\` that takes an array of subject grades with units:
\`[['grade' => 1.25, 'units' => 3], ['grade' => 1.5, 'units' => 4], ...]\`

Calculate the GWA:
\`GWA = (Sum of grade * units) / (Total units)\` (rounded to 2 decimal places)

And determine the academic award:
- GWA 1.00 to 1.20: "Summa Cum Laude"
- GWA 1.21 to 1.45: "Magna Cum Laude"
- GWA 1.46 to 1.75: "Cum Laude"
- GWA 1.76 to 3.00: "Passed"
- GWA > 3.00: "Failed"

Return an associative array: \`['gwa' => 1.39, 'standing' => 'Magna Cum Laude']\`.`,
    constraints: [
      '1 <= count($grades) <= 10',
      '1.00 <= grade <= 5.00',
      '1 <= units <= 6'
    ],
    examples: [
      {
        input: '[["grade" => 1.25, "units" => 3], ["grade" => 1.50, "units" => 3]]',
        output: '{"gwa":1.38,"standing":"Magna Cum Laude"}',
        explanation: 'Total units = 6. Weighted sum = (1.25*3) + (1.50*3) = 8.25. GWA = 8.25 / 6 = 1.375 -> rounded 1.38.'
      }
    ],
    starterCode: {
      php: `<?php
function calculateGWA(array $grades): array {
    $totalWeighted = 0;
    $totalUnits = 0;

    foreach ($grades as $subject) {
        $totalWeighted += $subject['grade'] * $subject['units'];
        $totalUnits += $subject['units'];
    }

    if ($totalUnits === 0) {
        return ['gwa' => 0.0, 'standing' => 'N/A'];
    }

    $gwa = round($totalWeighted / $totalUnits, 2);

    $standing = 'Passed';
    if ($gwa >= 1.00 && $gwa <= 1.20) {
        $standing = 'Summa Cum Laude';
    } elseif ($gwa <= 1.45) {
        $standing = 'Magna Cum Laude';
    } elseif ($gwa <= 1.75) {
        $standing = 'Cum Laude';
    } elseif ($gwa > 3.00) {
        $standing = 'Failed';
    }

    return ['gwa' => $gwa, 'standing' => $standing];
}

// Test sample
$sample = [
    ['grade' => 1.25, 'units' => 3],
    ['grade' => 1.50, 'units' => 3]
];
print_r(calculateGWA($sample));
?>`,
      javascript: `function calculateGWA(grades) {
  let totalWeighted = 0;
  let totalUnits = 0;
  for (const s of grades) {
    totalWeighted += s.grade * s.units;
    totalUnits += s.units;
  }
  const gwa = Number((totalWeighted / totalUnits).toFixed(2));
  let standing = 'Passed';
  if (gwa >= 1.00 && gwa <= 1.20) standing = 'Summa Cum Laude';
  else if (gwa <= 1.45) standing = 'Magna Cum Laude';
  else if (gwa <= 1.75) standing = 'Cum Laude';
  else if (gwa > 3.00) standing = 'Failed';
  return { gwa, standing };
}

console.log(calculateGWA([{ grade: 1.25, units: 3 }, { grade: 1.50, units: 3 }]));`,
      python: `def calculateGWA(grades: list[dict]) -> dict:
    total_weighted = sum(s['grade'] * s['units'] for s in grades)
    total_units = sum(s['units'] for s in grades)
    gwa = round(total_weighted / total_units, 2)
    if 1.00 <= gwa <= 1.20:
        standing = 'Summa Cum Laude'
    elif gwa <= 1.45:
        standing = 'Magna Cum Laude'
    elif gwa <= 1.75:
        standing = 'Cum Laude'
    elif gwa > 3.00:
        standing = 'Failed'
    else:
        standing = 'Passed'
    return {'gwa': gwa, 'standing': standing}`,
      typescript: `interface SubjectGrade {
  grade: number;
  units: number;
}

function calculateGWA(grades: SubjectGrade[]): { gwa: number; standing: string } {
  let totalWeighted = 0;
  let totalUnits = 0;
  for (const s of grades) {
    totalWeighted += s.grade * s.units;
    totalUnits += s.units;
  }
  const gwa = Number((totalWeighted / totalUnits).toFixed(2));
  let standing = 'Passed';
  if (gwa >= 1.00 && gwa <= 1.20) standing = 'Summa Cum Laude';
  else if (gwa <= 1.45) standing = 'Magna Cum Laude';
  else if (gwa <= 1.75) standing = 'Cum Laude';
  else if (gwa > 3.00) standing = 'Failed';
  return { gwa, standing };
}`
    },
    testCases: [
      { id: 'g1', input: '[{"grade":1.25,"units":3},{"grade":1.50,"units":3}]', expectedOutput: '{"gwa":1.38,"standing":"Magna Cum Laude"}' },
      { id: 'g2', input: '[{"grade":1.00,"units":3},{"grade":1.20,"units":3}]', expectedOutput: '{"gwa":1.1,"standing":"Summa Cum Laude"}' },
      { id: 'g3', input: '[{"grade":1.75,"units":4},{"grade":1.75,"units":3}]', expectedOutput: '{"gwa":1.75,"standing":"Cum Laude"}' }
    ],
    hints: [
      'Multiply each grade by its corresponding unit weight.',
      'Sum all weighted values and divide by the sum of units.',
      'In PHP, use round($val, 2) to format to 2 decimal places.'
    ],
    timeComplexity: 'O(n) where n is number of subjects',
    spaceComplexity: 'O(1) auxiliary variables'
  },
  {
    id: 'ch-web-dom',
    title: 'Dynamic Shopping Cart Total (JavaScript DOM & ES6)',
    slug: 'javascript-cart-calculator',
    difficulty: 'Easy',
    category: 'WebDev',
    points: 110,
    description: `Given an array of cart items where each item has \`name\`, \`price\`, and \`quantity\`, write a JavaScript function \`calculateCartTotal(items, discountPercent)\` that:

1. Computes the subtotal sum of \`(price * quantity)\`.
2. Applies the \`discountPercent\` (e.g. 10% off).
3. Adds 12% Value Added Tax (Philippine VAT) to the discounted subtotal.
4. Returns the final bill amount rounded to 2 decimal places.`,
    constraints: [
      '1 <= items.length <= 50',
      'price >= 0, quantity >= 1',
      '0 <= discountPercent <= 100'
    ],
    examples: [
      {
        input: 'items = [{ price: 100, quantity: 2 }], discountPercent = 10',
        output: '201.6',
        explanation: 'Subtotal = 200. After 10% discount = 180. With 12% VAT (180 * 1.12) = 201.60.'
      }
    ],
    starterCode: {
      javascript: `function calculateCartTotal(items, discountPercent = 0) {
  // 1. Calculate raw subtotal
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // 2. Apply discount
  const discounted = subtotal * (1 - (discountPercent / 100));
  
  // 3. Apply 12% VAT
  const total = discounted * 1.12;
  
  return Number(total.toFixed(2));
}

console.log(calculateCartTotal([{ price: 100, quantity: 2 }], 10));`,
      typescript: `interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

function calculateCartTotal(items: CartItem[], discountPercent: number = 0): number {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discounted = subtotal * (1 - (discountPercent / 100));
  const total = discounted * 1.12;
  return Number(total.toFixed(2));
}`,
      php: `<?php
function calculateCartTotal(array $items, float $discountPercent = 0): float {
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    $discounted = $subtotal * (1 - ($discountPercent / 100));
    $total = $discounted * 1.12;
    return round($total, 2);
}
?>`,
      python: `def calculateCartTotal(items: list[dict], discountPercent: float = 0) -> float:
    subtotal = sum(i['price'] * i['quantity'] for i in items)
    discounted = subtotal * (1 - (discountPercent / 100))
    total = discounted * 1.12
    return round(total, 2)`
    },
    testCases: [
      { id: 'c1', input: '[{"price":100,"quantity":2}], 10', expectedOutput: '201.6' },
      { id: 'c2', input: '[{"price":50,"quantity":4}], 0', expectedOutput: '224' }
    ],
    hints: [
      'Array.prototype.reduce() makes summing array objects clean and readable.',
      'VAT is applied after subtracting discount.'
    ],
    timeComplexity: 'O(n) single pass',
    spaceComplexity: 'O(1)'
  }
];

