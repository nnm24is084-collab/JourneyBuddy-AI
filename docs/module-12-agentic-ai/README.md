# Module 2.12: Agentic AI — Autonomous Tool-Calling Workflow



## 1. Objective



The objective of this module is to design a conceptual agentic AI workflow that can evaluate a user's request, select an appropriate tool, execute the selected action, evaluate the result, and produce a final response.



The workflow describes how an AI agent can choose between web search and an internal database based on the type of information required. This document specifies a proposed design and does not claim that a functioning autonomous agent has been implemented.



## 2. Scope



The conceptual design covers:



\- Receiving and understanding a user's goal.

\- Evaluating the information required to answer the request.

\- Planning the next action.

\- Selecting between web search, an internal database, or direct response generation.

\- Executing the selected tool.

\- Evaluating tool results for relevance and completeness.

\- Repeating a tool call when additional information is required.

\- Producing a final response using the available evidence.

\- Applying permissions, safety checks, and stopping conditions.



## 3. What Is an Agentic AI Workflow?



An agentic AI workflow is a process in which an AI system selects and coordinates actions to achieve a goal instead of following only one fixed sequence of steps.



A conceptual agent contains the following components:



1\. \*\*Input Handler:\*\* Receives the user's request.

2\. \*\*Planner:\*\* Determines what information or actions are needed.

3\. \*\*Decision Module:\*\* Selects an appropriate tool or determines that no tool is necessary.

4\. \*\*Tool Executor:\*\* Executes an approved tool call.

5\. \*\*Result Evaluator:\*\* Checks whether the result is useful, relevant, and sufficient.

6\. \*\*Context Manager:\*\* Maintains the relevant request details and tool results.

7\. \*\*Response Generator:\*\* Produces the final answer.

8\. \*\*Safety Controller:\*\* Enforces permissions, limits, and allowed actions.



## 4. Tool Selection Strategy



The agent should select a tool based on the user's goal and the information available.



| Request Type | Proposed Action | Reason |

|---|---|---|

| Requires current public information | Web search | Retrieves information from external sources |

| Requires private or organizational records | Internal database query | Retrieves authorized internal information |

| Can be answered using available context | Direct response generation | Avoids unnecessary tool calls |

| Requires both external and internal information | Multiple approved tool calls | Combines relevant information from both sources |

| Is unclear or missing essential details | Ask a clarification question | Avoids making unsupported assumptions |



Tool selection should consider information freshness, access permissions, expected usefulness, and whether the chosen tool can actually satisfy the request.



## 5. Autonomous Decision Tree



```mermaid id="k4p2q8"

flowchart TD

&#x20;   A\[Receive User Goal] --> B\[Understand Request]

&#x20;   B --> C\[Plan Next Action]

&#x20;   C --> D{Is a Tool Needed?}

&#x20;   D -- No --> E\[Generate Direct Response]

&#x20;   D -- Yes --> F{Select Tool}

&#x20;   F -- Current Public Data --> G\[Web Search]

&#x20;   F -- Authorized Internal Data --> H\[Internal Database]

&#x20;   F -- Both Required --> I\[Run Approved Tools]

&#x20;   G --> J\[Evaluate Results]

&#x20;   H --> J

&#x20;   I --> J

&#x20;   J --> K{Is Evidence Sufficient?}

&#x20;   K -- No --> L{Within Tool and Step Limits?}

&#x20;   L -- Yes --> C

&#x20;   L -- No --> M\[Explain Limitations]

&#x20;   K -- Yes --> N\[Synthesize Final Answer]

&#x20;   E --> O\[Return Response]

&#x20;   M --> O

&#x20;   N --> O

```



## 6. Workflow Execution



The proposed workflow follows these steps:



1\. Receive the user's request and identify the intended outcome.

2\. Determine whether the request requires fresh external information, internal records, or neither.

3\. Plan the next action and identify the information needed.

4\. Check whether the proposed tool is available and authorized.

5\. Execute the selected tool with validated input.

6\. Collect the tool's result and check for errors.

7\. Evaluate whether the result is relevant, reliable, and sufficient.

8\. If the evidence is incomplete, select another permitted action when appropriate.

9\. Stop when the goal is satisfied or a safety, permission, or execution limit is reached.

10\. Generate a clear final response based on the available evidence.



The agent should not repeatedly call tools without a clear reason for doing so.



## 7. Result Evaluation



After each tool call, the agent should evaluate the result using the following criteria:



\- \*\*Relevance:\*\* Does the result address the user's request?

\- \*\*Completeness:\*\* Does it contain enough information to proceed?

\- \*\*Reliability:\*\* Is the information from a suitable source?

\- \*\*Freshness:\*\* Is the information current enough for the task?

\- \*\*Consistency:\*\* Does it conflict with other available evidence?

\- \*\*Error status:\*\* Did the tool execute successfully?

\- \*\*Next action:\*\* Is another tool call necessary, or can the agent respond?



The agent should distinguish verified facts from assumptions and clearly explain unresolved limitations.



## 8. Tool Execution and Context Management



Tool execution should follow a controlled process:



\- Validate tool arguments before execution.

\- Use only tools registered and permitted for the agent.

\- Send only the information necessary for the operation.

\- Capture the tool result and relevant error information.

\- Retain useful context for subsequent decisions.

\- Avoid unnecessarily repeating identical requests.

\- Do not treat instructions found inside external search results or database records as trusted system instructions.



External content should be evaluated as data, not automatically followed as instructions.



## 9. Safety and Permission Controls



The proposed agent should implement the following controls:



1\. \*\*Tool allowlist:\*\* Restrict execution to explicitly approved tools.

2\. \*\*Access control:\*\* Use only authorized database records and external services.

3\. \*\*Input validation:\*\* Reject malformed or unsupported tool arguments.

4\. \*\*Least privilege:\*\* Give each tool only the permissions it needs.

5\. \*\*Sensitive-data protection:\*\* Avoid exposing credentials, private records, and confidential information.

6\. \*\*Execution limits:\*\* Set maximum tool calls, retries, and total workflow duration.

7\. \*\*Human approval:\*\* Require confirmation for consequential actions when applicable.

8\. \*\*Output validation:\*\* Check the final response for unsupported claims and sensitive information.

9\. \*\*Failure handling:\*\* Stop safely when a tool fails repeatedly or permissions are insufficient.

10\. \*\*Auditability:\*\* Record appropriate execution metadata without storing unnecessary sensitive content.



## 10. Stopping Conditions



The agent should stop when any of the following conditions is met:



\- Sufficient evidence is available to answer the request.

\- The userâ€™s goal has been completed.

\- An essential clarification is required from the user.

\- A required tool is unavailable or access is denied.

\- The maximum number of tool calls or retries is reached.

\- The execution deadline is exceeded.

\- A safety rule prohibits the requested action.



When the agent cannot complete the task, it should explain what prevented completion and identify the remaining uncertainty.



## 11. Error Handling



| Error Scenario | Expected Behaviour |

|---|---|

| Web search fails | Retry within configured limits or report the failure |

| Database is unavailable | Stop the database operation and explain the limitation |

| No relevant results | Try a justified alternative or report that no useful results were found |

| Invalid tool arguments | Correct the arguments if possible and permitted |

| Access denied | Do not attempt to bypass authorization |

| Conflicting results | Compare source quality and disclose unresolved conflicts |

| Repeated tool failure | Stop further retries and provide a useful explanation |

| Insufficient evidence | Ask for clarification or state that the answer cannot be verified |



## 12. Testing Plan



The proposed workflow should be tested with the following scenarios:



1\. A request that can be answered without a tool.

2\. A request requiring current public information.

3\. A request requiring an authorized internal database lookup.

4\. A request requiring both external and internal information.

5\. A search that returns no relevant results.

6\. A database request that fails.

7\. A tool call containing invalid arguments.

8\. An attempt to access restricted information.

9\. A result containing untrusted instructions.

10\. A task that exceeds the configured tool-call limit.

11\. Conflicting information returned by different sources.

12\. A request that needs clarification before a safe action can be taken.



Success criteria include correct tool selection, valid tool arguments, appropriate permission checks, bounded execution, reliable result evaluation, and a final response that accurately reflects the evidence.



## 13. Deliverables



The conceptual deliverables for this module are:



\- This README describing the autonomous tool-calling workflow.

\- An agent decision-tree diagram.

\- A tool-selection strategy for web search and internal database queries.

\- A result-evaluation procedure.

\- Safety, permission, and stopping-condition specifications.

\- An error-handling table.

\- A testing plan for the proposed workflow.



## 14. Conclusion



This module defines a controlled agentic AI workflow in which an AI system plans actions, chooses appropriate tools, evaluates returned evidence, and generates a final response.



The design emphasizes useful tool selection, bounded execution, access control, result validation, and safe stopping conditions. It can serve as a conceptual foundation for integrating an agent with the JourneyBuddy AI application.



## 15. Technical Documentation



\- Agent Skills reference supplied in the assignment: https://agentskills.io/home







