# Installation Guide

## Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher recommended)

## Steps to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/leetcode-160-intersection-of-two-linked-lists.git
   cd leetcode-160-intersection-of-two-linked-lists
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## How to Use the Application

1. Click the "Create Example" button to create a sample linked list example with an intersection.
2. Use the dropdown to select different solution approaches (Brute Force, Hash Set, Two Pointers).
3. Click "Step" to progress through the algorithm one step at a time.
4. Click "Run" to automatically execute the algorithm.
5. Click "Reset" to restart the current approach.
6. Use the speed slider to control the animation speed when using "Run".

## Project Structure

- `src/components/`: React components for visualizing linked lists and solutions
- `src/utils/linkedListUtils.ts`: Utility functions for working with linked lists and implementing solutions
- `src/types.ts`: TypeScript type definitions for the project
- `src/App.tsx`: Main application component
- `src/index.tsx`: Entry point for the React application 