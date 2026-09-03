# Contributing to Ghost Protocol

Thank you for your interest in contributing to Ghost Protocol! We welcome contributions to smart contracts, frontend client applications, documentation, cryptography tooling, and test coverage.

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   `ash
   git clone https://github.com/<your-username>/GHOST.git
   cd GHOST
   `
3. **Install dependencies**:
   `ash
   npm install
   cd apps/web && npm install && cd ../..
   `

## Development Workflow

### Branching Strategy

Create a branch with a descriptive name from main:
`ash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
`

### Commit Guidelines

We use conventional commit messages:
- eat: A new feature
- ix: A bug fix
- docs: Documentation only changes
- efactor: Code refactoring without changing functionality
- 	est: Adding or updating tests
- chore: Maintenance tasks

### Testing & Verification

Before submitting your PR, ensure that:
1. Smart contracts compile cleanly:
   `ash
   npx hardhat compile
   `
2. Hardhat test suite passes:
   `ash
   npx hardhat test
   `
3. Web application builds with zero TypeScript errors:
   `ash
   cd apps/web && npm run build
   `

## Pull Request Submission

1. Push your branch to GitHub:
   `ash
   git push origin feat/your-feature-name
   `
2. Open a Pull Request against the main branch.
3. Fill out the [Pull Request Template](.github/pull_request_template.md) completely.
4. A maintainer will review your code and provide feedback.
