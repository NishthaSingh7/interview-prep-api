module.exports = {
  readMin: 8,
  updated: "2026-07-03",
  patternName: "Two Pointers",
  tags: ["array", "two-pointers"],
  statement: {
    description:
      "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We use the integers 0, 1, and 2 to represent red, white, and blue respectively. You must solve this without using the library's sort function.",
    examples: [
      {
        input: "nums = [2,0,2,1,1,0]",
        output: "[0,0,1,1,2,2]",
        explanation: "All 0s grouped first, then 1s, then 2s.",
      },
      {
        input: "nums = [2,0,1]",
        output: "[0,1,2]",
        explanation: "Three-way partition on a small array.",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 300",
      "nums[i] is 0, 1, or 2 only.",
    ],
    followUp: "Could you solve it in one pass using only constant extra space?",
  },
  sections: [
    {
      id: "understanding",
      title: "Understanding the Problem",
      blocks: [
        {
          type: "p",
          text: "A comparison sort would produce the correct order, but the problem forbids the library sort function. The follow-up asks for a single pass — both constraints point toward an algorithm that uses structure general sorting ignores.",
        },
        {
          type: "p",
          text: "The array holds only three distinct values: 0, 1, and 2. You are not ordering arbitrary numbers; you are partitioning into three groups. That allows linear-time strategies that never compare two arbitrary elements.",
        },
        {
          type: "p",
          text: "This is the Dutch National Flag problem (Dijkstra): partition around pivot value 1. Everything less goes left, equal stays in the middle, greater goes right.",
        },
        {
          type: "h3",
          text: "What approaches might work?",
        },
        {
          type: "ul",
          items: [
            "Counting sort (two pass) — count 0s, 1s, 2s then rewrite the array.",
            "Dutch national flag (one pass) — three pointers partition while scanning.",
            "General sort — works but ignores the follow-up and the three-value structure.",
          ],
        },
        {
          type: "h3",
          text: "Key constraints",
        },
        {
          type: "ul",
          items: [
            "Only three values → counting or partitioning beats comparison sort.",
            "in-place → rearrange within nums, no extra result array.",
            "Follow-up shapes the target: one O(n) pass, O(1) space.",
          ],
        },
      ],
    },
    {
      id: "counting-sort",
      title: "Approach 1: Counting Sort (Two Pass)",
      diagramType: "counting",
      blocks: [
        { type: "h3", text: "Intuition" },
        {
          type: "p",
          text: "Count occurrences of 0, 1, and 2, then overwrite nums with that many zeros, ones, and twos. With a three-symbol alphabet, counts alone determine the sorted order.",
        },
        { type: "h3", text: "Algorithm" },
        {
          type: "ol",
          items: [
            "Iterate through nums and increment count0, count1, count2.",
            "Overwrite nums with count0 zeros, count1 ones, count2 twos.",
          ],
        },
        { type: "h3", text: "Example walkthrough" },
        {
          type: "walkthrough",
          steps: [
            "Input: nums = [2, 0, 2, 1, 1, 0]",
            "Pass 1 — count: two 0s, two 1s, two 2s.",
            "Pass 2 — write indices 0–1 as 0, 2–3 as 1, 4–5 as 2.",
            "Output: [0, 0, 1, 1, 2, 2]",
          ],
        },
        { type: "h3", text: "Code" },
        {
          type: "code",
          lang: "javascript",
          text: `function sortColors(nums) {
  let count0 = 0, count1 = 0, count2 = 0;
  for (const x of nums) {
    if (x === 0) count0++;
    else if (x === 1) count1++;
    else count2++;
  }
  let i = 0;
  while (count0--) nums[i++] = 0;
  while (count1--) nums[i++] = 1;
  while (count2--) nums[i++] = 2;
}`,
        },
        {
          type: "complexity",
          time: "O(n). One pass to count, one to write.",
          space: "O(1). Three integer counters.",
        },
        {
          type: "p",
          text: "Reads the array twice. The next approach answers the follow-up in a single pass.",
        },
      ],
    },
    {
      id: "dutch-flag",
      title: "Approach 2: Dutch National Flag (Three Pointers)",
      diagramType: "dutch-flag",
      blocks: [
        { type: "h3", text: "Intuition" },
        {
          type: "p",
          text: "Maintain three regions: before low (0s), low..mid-1 (1s), mid..high unprocessed, after high (2s). mid scans; swap 0s to low region, advance on 1, swap 2s to high without advancing mid.",
        },
        { type: "h3", text: "Correctness" },
        {
          type: "callout",
          text: "Invariants: nums[0..low-1]=0, nums[low..mid-1]=1, nums[mid..high] unprocessed, nums[high+1..n-1]=2.",
        },
        { type: "h3", text: "Algorithm" },
        {
          type: "ol",
          items: [
            "low = 0, mid = 0, high = n - 1.",
            "While mid <= high: 0 → swap(low,mid), low++, mid++; 1 → mid++; 2 → swap(mid,high), high--.",
          ],
        },
        { type: "h3", text: "Example walkthrough" },
        {
          type: "walkthrough",
          steps: [
            "Input: [2,0,2,1,1,0]. low=0, mid=0, high=5.",
            "mid=0 val 2 → swap with high → [0,0,2,1,1,2], high=4.",
            "mid=0 val 0 → swap low,mid → advance both → low=1, mid=1.",
            "mid=1 val 0 → swap → [0,0,2,1,1,2], low=2, mid=2.",
            "mid=2 val 2 → swap with high → [0,0,1,1,2,2], high=3.",
            "mid=2 val 1 → mid=3; mid=3 val 1 → mid=4; done.",
            "Output: [0,0,1,1,2,2].",
          ],
        },
        { type: "h3", text: "Code" },
        {
          type: "code",
          lang: "javascript",
          text: `function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
        },
        {
          type: "complexity",
          time: "O(n). Each step advances mid or shrinks high.",
          space: "O(1). Three pointers only.",
        },
      ],
    },
  ],
};
