import { VisualizerAlgorithm } from '../types';

export interface AlgorithmStep {
  array: number[];
  comparingIndices: number[];
  swappedIndices?: number[];
  sortedIndices: number[];
  pointers?: Record<string, number>;
  description: string;
  codeHighlightLine?: number;
}

export interface DSATopicMeta {
  id: VisualizerAlgorithm;
  title: string;
  category: 'Sorting' | 'Searching' | 'Two Pointers' | 'Trees';
  timeBest: string;
  timeAverage: string;
  timeWorst: string;
  spaceComplexity: string;
  description: string;
  conceptSummary: string;
  pseudocode: string[];
}

export const DSA_TOPICS: DSATopicMeta[] = [
  {
    id: 'bubble-sort',
    title: 'Bubble Sort',
    category: 'Sorting',
    timeBest: 'O(n)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    conceptSummary: 'In each pass, the highest unsorted number "bubbles up" to its correct position at the end of the array.',
    pseudocode: [
      'for i = 0 to n - 1:',
      '  for j = 0 to n - i - 1:',
      '    if arr[j] > arr[j + 1]:',
      '      swap(arr[j], arr[j + 1])'
    ]
  },
  {
    id: 'selection-sort',
    title: 'Selection Sort',
    category: 'Sorting',
    timeBest: 'O(n²)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Divides the list into a sorted and unsorted region. Repeatedly finds the minimum element from the unsorted region and puts it at the beginning.',
    conceptSummary: 'Minimizes the number of swaps (at most O(n) swaps), useful when memory write operations are expensive.',
    pseudocode: [
      'for i = 0 to n - 1:',
      '  min_idx = i',
      '  for j = i + 1 to n:',
      '    if arr[j] < arr[min_idx]: min_idx = j',
      '  swap(arr[i], arr[min_idx])'
    ]
  },
  {
    id: 'insertion-sort',
    title: 'Insertion Sort',
    category: 'Sorting',
    timeBest: 'O(n)',
    timeAverage: 'O(n²)',
    timeWorst: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
    conceptSummary: 'Adaptive and stable; extremely fast for small datasets or arrays that are already nearly sorted.',
    pseudocode: [
      'for i = 1 to n:',
      '  key = arr[i]',
      '  j = i - 1',
      '  while j >= 0 and arr[j] > key:',
      '    arr[j + 1] = arr[j]; j = j - 1',
      '  arr[j + 1] = key'
    ]
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    category: 'Searching',
    timeBest: 'O(1)',
    timeAverage: 'O(log n)',
    timeWorst: 'O(log n)',
    spaceComplexity: 'O(1)',
    description: 'Finds the position of a target value within a sorted array. Binary search compares the target value to the middle element of the array.',
    conceptSummary: 'Halves the search space on every iteration. Essential for logarithmic time efficiency in software engineering.',
    pseudocode: [
      'low = 0, high = n - 1',
      'while low <= high:',
      '  mid = low + (high - low) / 2',
      '  if arr[mid] == target: return mid',
      '  else if arr[mid] < target: low = mid + 1',
      '  else: high = mid - 1'
    ]
  },
  {
    id: 'two-pointers',
    title: 'Two Pointers (Pair Sum)',
    category: 'Two Pointers',
    timeBest: 'O(n)',
    timeAverage: 'O(n)',
    timeWorst: 'O(n)',
    spaceComplexity: 'O(1)',
    description: 'Maintains two pointers pointing to the opposite ends of a sorted array and converges inward based on comparison against target sum.',
    conceptSummary: 'Solves sorted array problems without nested loops, turning O(n²) into O(n).',
    pseudocode: [
      'left = 0, right = n - 1',
      'while left < right:',
      '  current_sum = arr[left] + arr[right]',
      '  if current_sum == target: return [left, right]',
      '  else if current_sum < target: left++',
      '  else: right--'
    ]
  }
];

// Generator functions for algorithmic steps
export function generateBubbleSortSteps(initialArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: [],
    description: 'Initial unsorted array. Preparing to bubble largest elements rightward.'
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparingIndices: [j, j + 1],
        sortedIndices: [...sorted],
        description: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]}).`
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          array: [...arr],
          comparingIndices: [j, j + 1],
          swappedIndices: [j, j + 1],
          sortedIndices: [...sorted],
          description: `Swapped ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`
        });
      }
    }
    sorted.unshift(n - 1 - i);
    steps.push({
      array: [...arr],
      comparingIndices: [],
      sortedIndices: [...sorted],
      description: `Element ${arr[n - 1 - i]} is now placed in its final sorted position.`
    });
  }
  sorted.unshift(0);
  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: [...sorted],
    description: 'Sorting complete! Entire array is sorted in ascending order.'
  });

  return steps;
}

export function generateSelectionSortSteps(initialArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: [],
    description: 'Starting Selection Sort: Scanning for smallest element in unsorted portion.'
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparingIndices: [minIdx, j],
        sortedIndices: [...sorted],
        pointers: { min: minIdx, current: j },
        description: `Comparing candidate minimum arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]}).`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparingIndices: [minIdx],
          sortedIndices: [...sorted],
          pointers: { min: minIdx },
          description: `Found new minimum element: ${arr[minIdx]} at index ${minIdx}.`
        });
      }
    }

    if (minIdx !== i) {
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        comparingIndices: [i, minIdx],
        swappedIndices: [i, minIdx],
        sortedIndices: [...sorted],
        description: `Swapped arr[${i}] and arr[${minIdx}] to place minimum value ${arr[i]} at index ${i}.`
      });
    }

    sorted.push(i);
    steps.push({
      array: [...arr],
      comparingIndices: [],
      sortedIndices: [...sorted],
      description: `Index ${i} with value ${arr[i]} is now sorted.`
    });
  }

  sorted.push(n - 1);
  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: [...sorted],
    description: 'Selection Sort completed successfully!'
  });

  return steps;
}

export function generateBinarySearchSteps(sortedArray: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...sortedArray];
  let low = 0;
  let high = arr.length - 1;

  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    pointers: { low, high },
    description: `Binary search for target = ${target} across range [${low}..${high}].`
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    const midVal = arr[mid];

    steps.push({
      array: [...arr],
      comparingIndices: [mid],
      sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
      pointers: { low, mid, high },
      description: `Calculated mid = ${mid} (value = ${midVal}). Comparing with target ${target}.`
    });

    if (midVal === target) {
      steps.push({
        array: [...arr],
        comparingIndices: [mid],
        swappedIndices: [mid],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { match: mid },
        description: `Target ${target} found at index ${mid}!`
      });
      return steps;
    }

    if (midVal < target) {
      low = mid + 1;
      steps.push({
        array: [...arr],
        comparingIndices: [],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { low, high },
        description: `${midVal} < ${target}. Discarding left half. New low = ${low}.`
      });
    } else {
      high = mid - 1;
      steps.push({
        array: [...arr],
        comparingIndices: [],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { low, high },
        description: `${midVal} > ${target}. Discarding right half. New high = ${high}.`
      });
    }
  }

  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    description: `Target ${target} does not exist in array. Returned -1.`
  });

  return steps;
}

export function generateTwoPointersSteps(sortedArray: number[], targetSum: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...sortedArray];
  let left = 0;
  let right = arr.length - 1;

  steps.push({
    array: [...arr],
    comparingIndices: [left, right],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    pointers: { left, right },
    description: `Target sum = ${targetSum}. Initializing left pointer at index ${left} (${arr[left]}) and right at index ${right} (${arr[right]}).`
  });

  while (left < right) {
    const sum = arr[left] + arr[right];
    steps.push({
      array: [...arr],
      comparingIndices: [left, right],
      sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
      pointers: { left, right },
      description: `Current sum = ${arr[left]} + ${arr[right]} = ${sum}. Target is ${targetSum}.`
    });

    if (sum === targetSum) {
      steps.push({
        array: [...arr],
        comparingIndices: [left, right],
        swappedIndices: [left, right],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { left, right },
        description: `Match found! Indices [${left}, ${right}] sum up to target ${targetSum}.`
      });
      return steps;
    }

    if (sum < targetSum) {
      left++;
      steps.push({
        array: [...arr],
        comparingIndices: [left, right],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { left, right },
        description: `${sum} < ${targetSum}. Incrementing left pointer to ${left} to increase sum.`
      });
    } else {
      right--;
      steps.push({
        array: [...arr],
        comparingIndices: [left, right],
        sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
        pointers: { left, right },
        description: `${sum} > ${targetSum}. Decrementing right pointer to ${right} to decrease sum.`
      });
    }
  }

  steps.push({
    array: [...arr],
    comparingIndices: [],
    sortedIndices: Array.from({ length: arr.length }, (_, i) => i),
    description: `No two numbers in the array sum up to ${targetSum}.`
  });

  return steps;
}
