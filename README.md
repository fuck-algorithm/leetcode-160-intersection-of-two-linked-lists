# Intersection of Two Linked Lists - LeetCode Visualization

This is a React + TypeScript application demonstrating the solution to the LeetCode problem #160: Intersection of Two Linked Lists.

## Problem Description

Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.

## Solution Approaches

The visualization demonstrates multiple solution approaches:
1. **Brute Force**: Check every node in list A against every node in list B (O(m*n))
2. **Hash Set**: Store all nodes from list A in a hash set, then check nodes from list B (O(m+n))
3. **Two Pointers**: Use a special two-pointer technique to find the intersection (O(m+n))

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Features

- Interactive visualization of linked lists
- Step-by-step walkthrough of the solution algorithms
- Ability to create custom linked list examples 