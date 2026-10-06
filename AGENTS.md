# Portfolio contributors

Before changing a project, its presentation or portfolio copy, read [docs/DESIGN.md](docs/DESIGN.md) and the [portfolio agent playbook](docs/PORTFOLIO_AGENT.md). DESIGN defines the accepted visual/editorial system and verified product boundaries; the playbook provides the evidence workflow, current extension seams and executable acceptance checks. Reconcile new approved direction in these documents instead of leaving contradictory guidance.

Keep project content in typed modules under `src/projects/`, registered through the ordered `src/projects.ts` collection. Keep project-specific presentation out of the shared shell; use the explicit presentation cases described in the playbook. Trace the reachable product implementation before making real claims; concepts remain clearly fictional. Preserve user-approved regions and honor explicit deletions without replacement content or controls.

For visual changes, inspect supplied screenshot pixels and the actual render. Compare the project with Forma on desktop and mobile in Browse and technical content, plus Immerse where supported. JadeWords exposes its full presentation immediately and has no expansion mode. Verify focus, scoped keys, Escape/exit, history, reduced motion and missing media as applicable, then run lint, tests, production build and relevant browser checks. Unit tests alone do not establish visual quality.

Use the existing stack and approved small local assets. Preserve `.git`, unrelated work, unpublished commits and product-source repositories. Stage only task-owned files. Do not deploy, merge or push without current authorization for that action.
