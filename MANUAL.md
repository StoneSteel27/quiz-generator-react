# Quiz JSON Format Manual

## 1. Overview

This document outlines the correct JSON structure required for the quiz application. The root of the JSON file must be an array of `Question` objects.

---

## 2. Root Structure

The JSON file should start with `[` and end with `]`, representing an array of questions.

```json
[
  { ... Question Object 1 ... },
  { ... Question Object 2 ... },
  { ... Question Object 3 ... }
]
```

---

## 3. The `Question` Object

Each object in the array represents a single question and must have the following properties:

| Key              | Type      | Required | Description                                                                                              |
|------------------|-----------|----------|----------------------------------------------------------------------------------------------------------|
| `questionText`   | `String`  | Yes      | The text of the question to be displayed.                                                                |
| `options`        | `Array`   | Yes      | An array of `Option` objects. Must contain at least one option.                                          |
| `isMultiSelect`  | `Boolean` | No       | Set to `true` if the question allows multiple correct answers. If omitted, it defaults to a single-choice question (`false`). |

### Example `Question` Object:
```json
{
  "questionText": "What does JSX stand for?",
  "isMultiSelect": false,
  "options": [
    { ... Option Object 1 ... },
    { ... Option Object 2 ... }
  ]
}
```

---

## 4. The `Option` Object

Each object in the `options` array represents a possible answer for a question. It must have the following properties:

| Key           | Type      | Required | Description                                                                 |
|---------------|-----------|----------|-----------------------------------------------------------------------------|
| `text`        | `String`  | Yes      | The answer text to be displayed for this option.                            |
| `isCorrect`   | `Boolean` | Yes      | Set to `true` if this is a correct answer, otherwise `false`.               |
| `explanation` | `String`  | Yes      | The text that explains why this option is correct or incorrect. This is shown to the user after they submit their answer. |

### Example `Option` Object:
```json
{
  "text": "JavaScript XML",
  "isCorrect": true,
  "explanation": "JSX is a syntax extension for JavaScript that looks similar to XML or HTML."
}
```

---

## 5. Complete JSON Example

Here is a complete, valid example of a quiz JSON file with two questions.

```json
[
  {
    "questionText": "What are the correct ways to write a component in React? (Select all that apply)",
    "isMultiSelect": true,
    "options": [
      {
        "text": "function MyComponent() { return <div>Hello</div>; }",
        "isCorrect": true,
        "explanation": "This is a standard functional component, the modern and recommended way to write React components."
      },
      {
        "text": "<component>MyComponent</component>",
        "isCorrect": false,
        "explanation": "This syntax is not valid for defining a component in JSX or JavaScript."
      },
      {
        "text": "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
        "isCorrect": true,
        "explanation": "This is a class component. While still valid, functional components with hooks are now more common."
      }
    ]
  },
  {
    "questionText": "What is the purpose of the `useEffect` hook?",
    "isMultiSelect": false,
    "options": [
      {
        "text": "To manage component state",
        "isCorrect": false,
        "explanation": "`useState` or `useReducer` are the hooks used for managing component state."
      },
      {
        "text": "To perform side effects in functional components",
        "isCorrect": true,
        "explanation": "`useEffect` is used for side effects like data fetching, subscriptions, or manually changing the DOM."
      },
      {
        "text": "To create a reference to a DOM element",
        "isCorrect": false,
        "explanation": "`useRef` is the hook used for creating references to DOM elements or for storing any mutable value."
      }
    ]
  }
]
```
